import { neon, neonConfig } from '@neondatabase/serverless';

// Disable Neon's client-side SQL execution browser warning
neonConfig.disableWarningInBrowsers = true;

// Default restricted read-only connection string for public storefront
// Role: vyram_reader (can ONLY SELECT active products, cannot insert/update/delete)
const DEFAULT_READONLY_URL =
  'postgresql://vyram_reader:vyram_readonly_pub_2026@ep-divine-grass-b4ypw7t1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

const DEFAULT_ADMIN_URL =
  'postgresql://vyram_admin:vyram_admin_secure_2026@ep-divine-grass-b4ypw7t1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

const readonlyUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NEON_READONLY_URL) ||
  DEFAULT_READONLY_URL;

let cachedStorefrontSql = null;

export const getStorefrontSql = () => {
  if (!cachedStorefrontSql) {
    cachedStorefrontSql = neon(readonlyUrl, { disableWarningInBrowsers: true });
  }
  return cachedStorefrontSql;
};

export const getAdminSql = (customConnStr = null) => {
  const connStr = customConnStr || DEFAULT_ADMIN_URL;
  return neon(connStr, { disableWarningInBrowsers: true });
};

/**
 * Normalizes a raw database product row into the frontend product model
 */
export const normalizeProductRow = (row) => {
  if (!row) return null;

  const priceNum = Number(row.price);
  const parsedPrice = Number.isFinite(priceNum) ? Math.round(priceNum * 100) / 100 : 0;

  const salePriceNum = row.sale_price !== null && row.sale_price !== undefined ? Number(row.sale_price) : null;
  const parsedSalePrice = salePriceNum !== null && Number.isFinite(salePriceNum) ? Math.round(salePriceNum * 100) / 100 : null;

  const category = String(row.category || '').trim();
  const categorySlug = String(category)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const imageUrl = String(row.image_url || '').trim();

  return {
    id: String(row.id),
    name: String(row.name || ''),
    slug: row.slug || String(row.id),
    category,
    categorySlug,
    subcategory: row.subcategory || null,
    bridal_collection: row.bridal_collection || null,
    collection: row.bridal_collection || '', // Backwards compatibility for storefront pages
    description: row.description || '',
    price: parsedPrice,
    sale_price: parsedSalePrice,
    image: imageUrl, // Canonical image used by Storefront
    image_url: imageUrl,
    image_file_id: row.image_file_id || null,
    image_path: row.image_path || null,
    additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
    search_keywords: row.search_keywords || '',
    searchKeywords: row.search_keywords || '', // Alias
    is_active: row.is_active !== false,
    sort_order: Number(row.sort_order) || 0,
    stock: row.stock !== undefined && row.stock !== null ? Number(row.stock) : 10,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

/**
 * Fetches all active products for the storefront
 */
export const fetchActiveProductsFromNeon = async () => {
  const sql = getStorefrontSql();
  const rows = await sql`
    SELECT 
      id, name, slug, category, subcategory, bridal_collection,
      description, price, sale_price, image_url, image_file_id, image_path,
      additional_images, search_keywords, is_active, sort_order, stock,
      created_at, updated_at
    FROM products
    WHERE is_active = true
    ORDER BY sort_order ASC, CASE WHEN id ~ '^[0-9]+$' THEN id::bigint ELSE NULL END ASC NULLS LAST, id ASC;
  `;

  return rows.map(normalizeProductRow);
};

/**
 * Fetches all products (including inactive) for Admin
 */
export const fetchAllProductsForAdmin = async (sqlClient = null) => {
  const sql = sqlClient || getAdminSql();
  const rows = await sql`
    SELECT 
      id, name, slug, category, subcategory, bridal_collection,
      description, price, sale_price, image_url, image_file_id, image_path,
      additional_images, search_keywords, is_active, sort_order, stock,
      created_at, updated_at
    FROM products
    ORDER BY CASE WHEN id ~ '^[0-9]+$' THEN id::bigint ELSE NULL END DESC NULLS LAST, id DESC;
  `;

  return rows.map(normalizeProductRow);
};

/**
 * Retrieves ImageKit client upload authorization tokens from PostgreSQL
 */
export const getImageKitAuthFromDB = async (sqlClient = null) => {
  const sql = sqlClient || getStorefrontSql();
  const result = await sql`SELECT get_imagekit_auth() AS auth;`;
  if (!result || !result[0] || !result[0].auth) {
    throw new Error('Failed to generate ImageKit upload signature from database.');
  }
  return result[0].auth;
};

/**
 * Uploads a file directly to ImageKit using client-side signature
 */
export const uploadFileToImageKit = async (file, fileName, authData, folder = '/vyram-jewells/products') => {
  const publicKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGEKIT_PUBLIC_KEY) ||
    'public_Ca3AKnGG0ii6MWxvOnyKWsY0cxM=';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);
  formData.append('publicKey', publicKey);
  formData.append('signature', authData.signature);
  formData.append('expire', String(authData.expire));
  formData.append('token', authData.token);
  formData.append('folder', folder);
  formData.append('useUniqueFileName', 'true');

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImageKit upload failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    url: data.url,
    fileId: data.fileId,
    filePath: data.filePath,
    thumbnailUrl: data.thumbnailUrl
  };
};

/**
 * Inserts a new product into Neon
 */
export const insertProductToNeon = async (productData, sqlClient = null) => {
  const sql = sqlClient || getAdminSql();

  const id = String(productData.id).trim();
  const name = String(productData.name).trim();
  const slug = productData.slug || id;
  const category = String(productData.category).trim();
  const subcategory = productData.subcategory || null;
  const bridalCollection = productData.bridal_collection || productData.collection || null;
  const description = productData.description || `Exquisite handcrafted ${name}, designed with timeless artistry for elegance and celebration.`;
  const price = Number(productData.price);
  const salePrice = productData.sale_price !== undefined && productData.sale_price !== null ? Number(productData.sale_price) : null;
  const imageUrl = productData.image_url || productData.image || null;
  const imageFileId = productData.image_file_id || null;
  const imagePath = productData.image_path || null;
  const additionalImages = JSON.stringify(productData.additional_images || []);
  const searchKeywords = productData.search_keywords || productData.searchKeywords || '';
  const isActive = productData.is_active !== false;
  const sortOrder = Number(productData.sort_order) || 0;
  const stock = Number(productData.stock) >= 0 ? Number(productData.stock) : 10;

  const rows = await sql`
    INSERT INTO products (
      id, name, slug, category, subcategory, bridal_collection,
      description, price, sale_price, image_url, image_file_id, image_path,
      additional_images, search_keywords, is_active, sort_order, stock,
      created_at, updated_at
    ) VALUES (
      ${id}, ${name}, ${slug}, ${category}, ${subcategory}, ${bridalCollection},
      ${description}, ${price}, ${salePrice}, ${imageUrl}, ${imageFileId}, ${imagePath},
      ${additionalImages}::jsonb, ${searchKeywords}, ${isActive}, ${sortOrder}, ${stock},
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING *;
  `;

  return normalizeProductRow(rows[0]);
};

/**
 * Updates an existing product in Neon
 */
export const updateProductInNeon = async (id, patch, sqlClient = null) => {
  const sql = sqlClient || getAdminSql();
  const targetId = String(id).trim();

  // Retrieve existing record first
  const existing = await sql`
    SELECT 
      id, name, slug, category, subcategory, bridal_collection,
      description, price, sale_price, image_url, image_file_id, image_path,
      additional_images, search_keywords, is_active, sort_order, stock,
      created_at, updated_at
    FROM products 
    WHERE id = ${targetId};
  `;
  if (!existing || existing.length === 0) {
    throw new Error(`Product with ID "${targetId}" not found.`);
  }

  const current = existing[0];
  const name = patch.name !== undefined ? String(patch.name).trim() : current.name;
  const slug = patch.slug !== undefined ? String(patch.slug).trim() : current.slug;
  const category = patch.category !== undefined ? String(patch.category).trim() : current.category;
  const subcategory = patch.subcategory !== undefined ? patch.subcategory : current.subcategory;
  const bridalCollection = patch.bridal_collection !== undefined ? patch.bridal_collection : (patch.collection !== undefined ? patch.collection : current.bridal_collection);
  const description = patch.description !== undefined ? patch.description : current.description;
  const price = patch.price !== undefined ? Number(patch.price) : Number(current.price);
  const salePrice = patch.sale_price !== undefined ? (patch.sale_price ? Number(patch.sale_price) : null) : current.sale_price;
  const imageUrl = patch.image_url !== undefined ? patch.image_url : (patch.image !== undefined ? patch.image : current.image_url);
  const imageFileId = patch.image_file_id !== undefined ? patch.image_file_id : current.image_file_id;
  const imagePath = patch.image_path !== undefined ? patch.image_path : current.image_path;
  const additionalImages = patch.additional_images !== undefined ? JSON.stringify(patch.additional_images) : JSON.stringify(current.additional_images || []);
  const searchKeywords = patch.search_keywords !== undefined ? patch.search_keywords : (patch.searchKeywords !== undefined ? patch.searchKeywords : current.search_keywords);
  const isActive = patch.is_active !== undefined ? patch.is_active : current.is_active;
  const sortOrder = patch.sort_order !== undefined ? Number(patch.sort_order) : current.sort_order;
  const stock = patch.stock !== undefined ? Number(patch.stock) : current.stock;

  const rows = await sql`
    UPDATE products
    SET
      name = ${name},
      slug = ${slug},
      category = ${category},
      subcategory = ${subcategory},
      bridal_collection = ${bridalCollection},
      description = ${description},
      price = ${price},
      sale_price = ${salePrice},
      image_url = ${imageUrl},
      image_file_id = ${imageFileId},
      image_path = ${imagePath},
      additional_images = ${additionalImages}::jsonb,
      search_keywords = ${searchKeywords},
      is_active = ${isActive},
      sort_order = ${sortOrder},
      stock = ${stock},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${targetId}
    RETURNING *;
  `;

  return normalizeProductRow(rows[0]);
};

/**
 * Deletes or deactivates a product in Neon
 */
export const deleteProductFromNeon = async (id, softDelete = true, sqlClient = null) => {
  const sql = sqlClient || getAdminSql();
  const targetId = String(id).trim();

  if (softDelete) {
    await sql`
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${targetId};
    `;
  } else {
    await sql`DELETE FROM products WHERE id = ${targetId};`;
  }

  return true;
};
