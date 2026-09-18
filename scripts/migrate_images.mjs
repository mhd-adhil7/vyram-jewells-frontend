import { createRequire } from 'module';
import path from 'path';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jRO4EXyoJ5Pp@ep-divine-grass-b4ypw7t1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

const IMAGEKIT_PRIVATE_KEY = 'private_AizEWOwgAtGhgU28Z3slaNyyWLQ=';
const authHeader = 'Basic ' + Buffer.from(IMAGEKIT_PRIVATE_KEY + ':').toString('base64');

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
      console.warn(`Attempt ${attempt} failed for ${fileName}:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function migrateImages() {
  console.log('--- Starting ImageKit Migration ---');

  const products = await sql`
    SELECT id, name, slug, image_url 
    FROM products 
    WHERE image_url LIKE '%ucare%'
    ORDER BY CASE WHEN id ~ '^[0-9]+$' THEN id::bigint ELSE NULL END ASC NULLS LAST, id ASC;
  `;

  console.log(`Found ${products.length} products with Uploadcare URLs.`);

  // Map of sourceUrl -> { url, fileId, filePath }
  const urlMap = new Map();

  // Find unique URLs
  const uniqueUrls = Array.from(new Set(products.map(p => p.image_url)));
  console.log(`Total unique images to migrate: ${uniqueUrls.length}`);

  const CONCURRENCY = 5;
  let completed = 0;

  for (let i = 0; i < uniqueUrls.length; i += CONCURRENCY) {
    const chunk = uniqueUrls.slice(i, i + CONCURRENCY);

    await Promise.all(
      chunk.map(async (ucareUrl) => {
        const prod = products.find(p => p.image_url === ucareUrl);
        const ext = ucareUrl.toLowerCase().includes('.heic') ? '.heic' : '.jpg';
        const cleanName = `vyram_p${prod.id}_${(prod.slug || 'product').slice(0, 30)}${ext}`;

        try {
          const ikResult = await uploadToImageKit(ucareUrl, cleanName);
          urlMap.set(ucareUrl, {
            url: ikResult.url,
            fileId: ikResult.fileId,
            filePath: ikResult.filePath
          });
          completed++;
          process.stdout.write(`Migrated ${completed}/${uniqueUrls.length}: ${cleanName}\n`);
        } catch (err) {
          console.error(`Failed to migrate image for product ${prod.id}:`, err.message);
        }
      })
    );
  }

  console.log(`Successfully uploaded ${urlMap.size} unique images to ImageKit.`);

  // Update Neon database records
  console.log('Updating Neon database records with ImageKit data...');
  let updatedCount = 0;

  for (const prod of products) {
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
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} products in Neon.`);

  // Verification
  const remainingUcare = await sql`
    SELECT count(*) FROM products WHERE image_url LIKE '%ucare%';
  `;
  const totalImageKit = await sql`
    SELECT count(*) FROM products WHERE image_url LIKE '%imagekit%';
  `;
  const totalProducts = await sql`
    SELECT count(*) FROM products;
  `;

  console.log('--- Migration Summary ---');
  console.log('Total Products in Neon:', totalProducts[0].count);
  console.log('Products with ImageKit URLs:', totalImageKit[0].count);
  console.log('Remaining Uploadcare URLs:', remainingUcare[0].count);

  if (Number(remainingUcare[0].count) === 0 && Number(totalImageKit[0].count) === 233) {
    console.log('✅ ALL 233 PRODUCT IMAGES SUCCESSFULLY MIGRATED TO IMAGEKIT!');
  } else {
    console.error('⚠️ Warning: Some products still have legacy URLs.');
  }
}

migrateImages().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
