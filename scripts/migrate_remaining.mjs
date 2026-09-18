import { createRequire } from 'module';
import path from 'path';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jRO4EXyoJ5Pp@ep-divine-grass-b4ypw7t1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

const IMAGEKIT_PRIVATE_KEY = 'private_AizEWOwgAtGhgU28Z3slaNyyWLQ=';
const authHeader = 'Basic ' + Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');

const cleanUploadcareUrl = (url) => {
  if (!url) return url;
  // Match standard Uploadcare UUID pattern
  const match = url.match(/^(https?:\/\/[^/]+\/[0-9a-f-]{36})/i);
  if (match) {
    return `${match[1]}/`;
  }
  return url.replace(/\/-\/.*/, '').replace(/\/?$/, '/');
};

async function uploadToImageKit(sourceUrl, fileName, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('file', sourceUrl);
      formData.append('fileName', fileName);
      formData.append('folder', '/vyram-jewells/products');
      formData.append('useUniqueFileName', 'true');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function migrateRemaining() {
  console.log('--- Migrating Remaining Uploadcare Products ---');

  const remaining = await sql`
    SELECT id, name, slug, image_url 
    FROM products 
    WHERE image_url LIKE '%ucare%'
    ORDER BY CASE WHEN id ~ '^[0-9]+$' THEN id::bigint ELSE NULL END ASC NULLS LAST, id ASC;
  `;

  console.log(`Found ${remaining.length} remaining products with Uploadcare URLs.`);

  const urlMap = new Map();
  const uniqueUrls = Array.from(new Set(remaining.map(p => p.image_url)));
  console.log(`Unique URLs to process: ${uniqueUrls.length}`);

  const CONCURRENCY = 5;
  let completed = 0;

  for (let i = 0; i < uniqueUrls.length; i += CONCURRENCY) {
    const chunk = uniqueUrls.slice(i, i + CONCURRENCY);

    await Promise.all(
      chunk.map(async (rawUrl) => {
        const prod = remaining.find(p => p.image_url === rawUrl);
        const cleanUrl = cleanUploadcareUrl(rawUrl);
        const cleanName = `vyram_p${prod.id}_${(prod.slug || 'product').slice(0, 30)}.jpg`;

        try {
          const ikResult = await uploadToImageKit(cleanUrl, cleanName);
          urlMap.set(rawUrl, {
            url: ikResult.url,
            fileId: ikResult.fileId,
            filePath: ikResult.filePath
          });
          completed++;
          process.stdout.write(`Migrated ${completed}/${uniqueUrls.length}: ${cleanName}\n`);
        } catch (err) {
          console.error(`Failed on product ${prod.id} (${cleanUrl}):`, err.message);
        }
      })
    );
  }

  console.log('Updating Neon for remaining products...');
  for (const prod of remaining) {
    const ikData = urlMap.get(prod.image_url);
    if (ikData) {
      await sql`
        UPDATE products
        SET 
          image_url = ${ikData.url},
          image_file_id = ${ikData.fileId},
          image_path = ${ikData.filePath},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${prod.id};
      `;
    }
  }

  const finalCheck = await sql`
    SELECT 
      count(*) FILTER (WHERE image_url LIKE '%imagekit%') as imagekit_count,
      count(*) FILTER (WHERE image_url LIKE '%ucare%') as ucare_count,
      count(*) as total_count
    FROM products;
  `;

  console.log('--- Final Database Status ---');
  console.log('Total Products:', finalCheck[0].total_count);
  console.log('Products with ImageKit:', finalCheck[0].imagekit_count);
  console.log('Remaining Uploadcare:', finalCheck[0].ucare_count);

  if (Number(finalCheck[0].ucare_count) === 0 && Number(finalCheck[0].imagekit_count) === 233) {
    console.log('🎉 SUCCESS! ALL 233 PRODUCTS NOW USE IMAGEKIT!');
  }
}

migrateRemaining().catch(console.error);
