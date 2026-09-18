import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { categoryLabels } from '../data/catalog';
import {
  fetchActiveProductsFromNeon,
  insertProductToNeon,
  updateProductInNeon,
  deleteProductFromNeon
} from '../../utils/neon';
import { DEFAULT_FALLBACK_IMAGE } from '../../utils/imagekit';

const CATALOG_CACHE_KEY = 'vyram_neon_catalog_cache';
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

export const ProductCatalogProvider = ({ children }) => {
  const [catalogProducts, setCatalogProducts] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CATALOG_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore cache read errors
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CATALOG_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return !(Array.isArray(parsed) && parsed.length > 0);
      }
    } catch {
      // Ignore
    }
    return true;
  });

  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const liveProducts = await fetchActiveProductsFromNeon();
      setCatalogProducts(liveProducts);
      setIsLoading(false);

      try {
        sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(liveProducts));
      } catch {
        // Ignore cache storage error
      }
    } catch (err) {
      console.error('Error refreshing products from Neon PostgreSQL:', err);
      setError(err.message || 'Failed to load product catalog');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const liveProducts = await fetchActiveProductsFromNeon();
        if (!cancelled) {
          setCatalogProducts(liveProducts);
          setIsLoading(false);
          try {
            sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(liveProducts));
          } catch {
            // Ignore
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading products from Neon PostgreSQL:', err);
          setError(err.message || 'Failed to load product catalog');
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const createProduct = useCallback(async (rawInput) => {
    const name = normalizeName(rawInput?.name);
    if (!name) throw new Error('Product name is required.');

    const category = normalizeCategory(rawInput?.category);
    const price = normalizePrice(rawInput?.price);
    if (price === null || price <= 0) throw new Error('Price must be greater than 0.');

    const stock = normalizeStock(rawInput?.stock, DEFAULT_STOCK);

    // Auto-generate numeric ID if not provided, or normalize
    const id = rawInput?.id ? String(rawInput.id).trim() : String(Date.now());
    const slug = normalizeId(rawInput?.slug || name);

    const imageUrl = rawInput?.image_url || rawInput?.image;
    if (!imageUrl) {
      throw new Error('Product image is required.');
    }

    const productPayload = {
      id,
      name,
      slug,
      category,
      subcategory: rawInput?.subcategory || null,
      bridal_collection: rawInput?.bridal_collection || rawInput?.collection || null,
      description: rawInput?.description || `Exquisite handcrafted ${name}, designed with timeless artistry for elegance and celebration.`,
      price,
      sale_price: rawInput?.sale_price ? normalizePrice(rawInput.sale_price) : null,
      image_url: imageUrl,
      image: imageUrl,
      image_file_id: rawInput?.image_file_id || null,
      image_path: rawInput?.image_path || null,
      additional_images: rawInput?.additional_images || [],
      search_keywords: rawInput?.search_keywords || rawInput?.searchKeywords || '',
      is_active: true,
      sort_order: rawInput?.sort_order || 0,
      stock
    };

    const saved = await insertProductToNeon(productPayload);

    setCatalogProducts((prev) => {
      const next = [saved, ...prev.filter((p) => String(p.id) !== String(saved.id))];
      try {
        sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    return saved;
  }, []);

  const updateProduct = useCallback(async (id, patch) => {
    const targetId = String(id).trim();
    if (!targetId) throw new Error('Product ID is required.');

    const updated = await updateProductInNeon(targetId, patch);

    setCatalogProducts((prev) => {
      const next = prev.map((p) => (String(p.id) === targetId ? updated : p));
      try {
        sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    return updated;
  }, []);

  const deleteProduct = useCallback(async (id, softDelete = true) => {
    const targetId = String(id).trim();
    if (!targetId) throw new Error('Product ID is required.');

    await deleteProductFromNeon(targetId, softDelete);

    setCatalogProducts((prev) => {
      const next = prev.filter((p) => String(p.id) !== targetId);
      try {
        sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    return true;
  }, []);

  const productsById = useMemo(
    () => Object.fromEntries(catalogProducts.map((p) => [String(p.id), p])),
    [catalogProducts]
  );

  const value = useMemo(
    () => ({
      products: catalogProducts,
      productsById,
      isLoading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct
    }),
    [
      catalogProducts,
      productsById,
      isLoading,
      error,
      fetchProducts,
      createProduct,
      updateProduct,
      deleteProduct
    ]
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
