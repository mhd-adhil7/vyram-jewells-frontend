import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { categoryLabels, defaultProductImage, products as seedProducts } from '../data/catalog';

const PRODUCTS_STORAGE_KEY = 'vyram_products';
const PRODUCT_CATEGORY_KEYS = Object.keys(categoryLabels).filter((key) => key !== 'all');
const DEFAULT_CATEGORY = PRODUCT_CATEGORY_KEYS[0] ?? 'bridal';
const DEFAULT_STOCK = 10;

const ProductCatalogContext = createContext(null);

const normalizeId = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeName = (value) => String(value ?? '').trim();

const slugifyCategory = (category) => {
  return String(category ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const normalizeCategory = (value) => {
  return String(value ?? '').trim() || DEFAULT_CATEGORY;
};

const normalizePrice = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.round(parsed * 100) / 100;
};

const normalizeStock = (value, fallback = DEFAULT_STOCK) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const transformUploadcareUrl = (url) => {
  if (!url) return url;
  
  const regex = /^(https?:\/\/[a-z0-9.-]+\.(?:ucarecd\.net|ucarecdn\.com)\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/([^\/]+))?$/i;
  const match = url.match(regex);
  
  if (match) {
    const base = match[1];
    const filename = match[2];
    
    if (url.includes('/-/')) {
      return url;
    }
    
    if (filename) {
      return `${base}/-/preview/-/format/auto/${filename}`;
    } else {
      return `${base}/-/preview/-/format/auto/`;
    }
  }
  
  return url;
};

const normalizeImage = (value) => {
  const image = String(value ?? '').trim();
  const transformed = transformUploadcareUrl(image);
  return transformed || defaultProductImage;
};

const validateCreateInput = (raw) => {
  const id = normalizeId(raw?.id);
  if (!id) {
    throw new Error('Product ID is required.');
  }

  const name = normalizeName(raw?.name);
  if (!name) {
    throw new Error('Product name is required.');
  }

  const category = normalizeCategory(raw?.category);
  if (!category) {
    throw new Error('Select a valid category.');
  }

  const price = normalizePrice(raw?.price);
  if (price === null || price <= 0) {
    throw new Error('Price must be greater than 0.');
  }

  const stock = normalizeStock(raw?.stock, -1);
  if (stock < 0) {
    throw new Error('Stock must be 0 or greater.');
  }

  return {
    id,
    name,
    category,
    categorySlug: slugifyCategory(category),
    searchKeywords: raw?.searchKeywords || raw?.search_keywords || '',
    price,
    image: normalizeImage(raw?.image),
    stock
  };
};

const validateUpdateInput = (raw) => {
  const name = normalizeName(raw?.name);
  if (!name) {
    throw new Error('Product name is required.');
  }

  const category = normalizeCategory(raw?.category);
  if (!category) {
    throw new Error('Select a valid category.');
  }

  const price = normalizePrice(raw?.price);
  if (price === null || price <= 0) {
    throw new Error('Price must be greater than 0.');
  }

  const stock = normalizeStock(raw?.stock, -1);
  if (stock < 0) {
    throw new Error('Stock must be 0 or greater.');
  }

  return {
    name,
    category,
    categorySlug: slugifyCategory(category),
    searchKeywords: raw?.searchKeywords || raw?.search_keywords || '',
    price,
    image: normalizeImage(raw?.image),
    stock
  };
};

const normalizeStoredProduct = (raw) => {
  const id = normalizeId(raw?.id);
  const name = normalizeName(raw?.name);
  const category = normalizeCategory(raw?.category);
  const price = normalizePrice(raw?.price);

  if (!id || !name || !category || price === null || price <= 0) {
    return null;
  }

  return {
    id,
    name,
    category,
    categorySlug: raw?.categorySlug || slugifyCategory(category),
    searchKeywords: raw?.searchKeywords || raw?.search_keywords || '',
    price,
    image: normalizeImage(raw?.image),
    stock: normalizeStock(raw?.stock)
  };
};

const uniqueProducts = (products) => {
  const seen = new Set();

  return products.filter((product) => {
    if (!product || seen.has(product.id)) {
      return false;
    }

    seen.add(product.id);
    return true;
  });
};

const _seedCatalogProducts = uniqueProducts(
  seedProducts
    .map((product) => normalizeStoredProduct({ ...product, stock: product.stock ?? DEFAULT_STOCK }))
    .filter(Boolean)
);

const _readStoredProducts = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    const normalized = uniqueProducts(parsed.map(normalizeStoredProduct).filter(Boolean));
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
};

const parseCSV = (csvText) => {
  const lines = [];
  let currentLine = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentToken += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentToken += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentToken);
        currentToken = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentLine.push(currentToken);
        lines.push(currentLine);
        currentLine = [];
        currentToken = '';
      } else {
        currentToken += char;
      }
    }
  }

  if (currentToken || currentLine.length > 0) {
    currentLine.push(currentToken);
    lines.push(currentLine);
  }

  return lines;
};

const _mapCategoryToInternal = (sheetCategory) => {
  const normalized = String(sheetCategory ?? '')
    .trim()
    .toLowerCase();

  switch (normalized) {
    case 'necklaces':
    case 'necklace':
      return 'necklaces';
    case 'earrings':
    case 'earring':
      return 'earrings';
    case 'rings':
    case 'ring':
      return 'rings';
    case 'bangles':
    case 'bangle':
      return 'bangles';
    case 'bridal':
    case 'bridal sets':
    case 'bridal-sets':
      return 'bridal';
    case 'temple':
    case 'temple jewellery':
    case 'temple-jewellery':
      return 'temple';
    case 'haram':
      return 'haram';
    case 'ear accessories':
    case 'ear-accessories':
      return 'ear-accessories';
    case 'tikkas':
    case 'tikka':
      return 'tikkas';
    case 'nose pins':
    case 'nose-pins':
    case 'nosepin':
    case 'nosepins':
      return 'nose-pins';
    case 'hip chains':
    case 'hip-chains':
      return 'hip-chains';
    case 'hair accessories':
    case 'hair-accessories':
      return 'hair-accessories';
    case 'anklets':
    case 'anklet':
      return 'anklets';
    default:
      return normalized.replace(/\s+/g, '-');
  }
};

const parseProductsFromCSV = (csvText) => {
  const rows = parseCSV(csvText);
  const headerIndex = rows.findIndex(row => {
    const cols = row.map(c => c.trim().toLowerCase());
    return cols.includes('id') && cols.includes('price') && cols.includes('category') && cols.includes('image');
  });

  if (headerIndex === -1) {
    throw new Error('Invalid CSV: Columns id, price, category, and image are required.');
  }

  const headers = rows[headerIndex].map(h => h.trim().toLowerCase());
  const idIdx = headers.indexOf('id');
  const nameIdx = headers.indexOf('name');
  const categoryIdx = headers.indexOf('category');
  const keywordsIdx = headers.findIndex(h => h === 'search_keywords' || h === 'search keywords' || h === 'keywords');
  const priceIdx = headers.indexOf('price');
  const imageIdx = headers.indexOf('image');

  const productsList = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length <= 1) continue;

    try {
      const idVal = row[idIdx]?.trim();
      if (!idVal) continue;

      const rawPrice = row[priceIdx] ?? '';
      const cleanedPrice = rawPrice.replace(/[^\d.]/g, '');
      const priceVal = parseFloat(cleanedPrice) || 0;

      const categoryVal = row[categoryIdx]?.trim() || '';
      const imageVal = row[imageIdx]?.trim() || '';

      let nameVal = nameIdx !== -1 ? row[nameIdx]?.trim() : '';
      if (!nameVal) {
        const fallbackCleanNames = {
          '1': 'Necklace',
          '2': 'Haram',
          '3': 'Earring',
          '4': 'Bridal Set'
        };
        const singularCategory = categoryVal.endsWith('s') ? categoryVal.slice(0, -1) : categoryVal;
        nameVal = fallbackCleanNames[idVal] || singularCategory || 'Jewellery';
      }

      // Never append, concatenate, or display the id with the product name.
      // If the name ends with the ID, strip it.
      const idStr = String(idVal);
      if (nameVal.endsWith(idStr)) {
        nameVal = nameVal.slice(0, -idStr.length).trim();
      }

      const keywordsVal = keywordsIdx !== -1 ? row[keywordsIdx]?.trim() : '';

      const productObj = {
        id: idVal,
        name: nameVal,
        price: priceVal,
        category: categoryVal,
        categorySlug: slugifyCategory(categoryVal),
        searchKeywords: keywordsVal,
        image: normalizeImage(imageVal),
        stock: 10
      };

      productsList.push(productObj);
    } catch (rowErr) {
      console.error(`Error parsing row ${i} in CSV:`, row, rowErr);
    }
  }

  return productsList;
};

export const ProductCatalogProvider = ({ children }) => {
  const [googleProducts, setGoogleProducts] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleError, setGoogleError] = useState(null);

  const fetchNecklaces = useCallback(async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const response = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGS3Vb_JRbgG_YZcewvzNi4InnNO-ngJxyQDbs89T_Evo_UVxUf9RaxQ0ahB8OrXxysF5TZoFV1RlT/pub?output=csv'
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch product data (HTTP status ${response.status})`);
      }
      const csvText = await response.text();
      console.log('Raw CSV response:', csvText);
      const parsed = parseProductsFromCSV(csvText);
      console.log('Parsed product data:', parsed);
      setGoogleProducts(parsed);
      setGoogleLoading(false);
    } catch (err) {
      console.error('Error fetching products from Google Sheets:', err);
      setGoogleError(err.message || 'Failed to fetch products');
      setGoogleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNecklaces();
  }, [fetchNecklaces]);

  const products = useMemo(() => {
    return googleProducts;
  }, [googleProducts]);

  const createProduct = useCallback((input) => {
    const nextProduct = validateCreateInput(input);
    if (products.some((item) => item.id === nextProduct.id)) {
      throw new Error('A product with this ID already exists.');
    }

    setGoogleProducts((prevProducts) => [nextProduct, ...prevProducts]);
  }, [products]);

  const updateProduct = useCallback((id, patch) => {
    const productId = normalizeId(id);
    if (!productId) {
      throw new Error('Product ID is required.');
    }

    const nextValues = validateUpdateInput(patch);
    if (!products.some((item) => item.id === productId)) {
      throw new Error('Product not found.');
    }

    setGoogleProducts((prevProducts) =>
      prevProducts.map((item) => (item.id === productId ? { ...item, ...nextValues } : item))
    );
  }, [products]);

  const deleteProduct = useCallback((id) => {
    const productId = normalizeId(id);
    if (!productId) {
      throw new Error('Product ID is required.');
    }

    setGoogleProducts((prevProducts) => prevProducts.filter((item) => item.id !== productId));
  }, []);

  const productsById = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      productsById,
      createProduct,
      updateProduct,
      deleteProduct,
      googleLoading,
      googleError,
      fetchNecklaces
    }),
    [products, productsById, createProduct, updateProduct, deleteProduct, googleLoading, googleError, fetchNecklaces]
  );

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProductCatalog = () => {
  const context = useContext(ProductCatalogContext);

  if (!context) {
    throw new Error('useProductCatalog must be used inside ProductCatalogProvider');
  }

  return context;
};
