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

const normalizeCategory = (value) => {
  const nextCategory = String(value ?? '')
    .trim()
    .toLowerCase();

  if (!nextCategory) {
    return DEFAULT_CATEGORY;
  }

  return PRODUCT_CATEGORY_KEYS.includes(nextCategory) ? nextCategory : null;
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

const normalizeImage = (value) => {
  const image = String(value ?? '').trim();
  return image || defaultProductImage;
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

const seedCatalogProducts = uniqueProducts(
  seedProducts
    .map((product) => normalizeStoredProduct({ ...product, stock: product.stock ?? DEFAULT_STOCK }))
    .filter(Boolean)
);

const readStoredProducts = () => {
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

export const ProductCatalogProvider = ({ children }) => {
  const [products, setProducts] = useState(() => readStoredProducts() ?? seedCatalogProducts);

  useEffect(() => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const createProduct = useCallback((input) => {
    const nextProduct = validateCreateInput(input);
    if (products.some((item) => item.id === nextProduct.id)) {
      throw new Error('A product with this ID already exists.');
    }

    setProducts((prevProducts) => [nextProduct, ...prevProducts]);
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

    setProducts((prevProducts) =>
      prevProducts.map((item) => (item.id === productId ? { ...item, ...nextValues } : item))
    );
  }, [products]);

  const deleteProduct = useCallback((id) => {
    const productId = normalizeId(id);
    if (!productId) {
      throw new Error('Product ID is required.');
    }

    setProducts((prevProducts) => prevProducts.filter((item) => item.id !== productId));
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
      deleteProduct
    }),
    [products, productsById, createProduct, updateProduct, deleteProduct]
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
