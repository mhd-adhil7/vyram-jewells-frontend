import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { wishlistDefaultIds } from '../data/catalog';
import { useProductCatalog } from './ProductCatalogContext';

const CART_STORAGE_KEY = 'vyram_cart';
const WISHLIST_STORAGE_KEY = 'vyram_wishlist';

const normalizeQuantity = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }

  return Math.floor(parsed);
};

const normalizeCart = (rawCart, productsById, nameToId) => {
  if (!Array.isArray(rawCart)) {
    return [];
  }

  const merged = new Map();

  rawCart.forEach((entry) => {
    let id = undefined;
    let quantity = 1;

    if (typeof entry === 'string') {
      id = entry;
    } else if (entry && typeof entry === 'object') {
      id = entry.id;
      if (!id && typeof entry.name === 'string') {
        id = nameToId.get(entry.name.toLowerCase());
      }
      quantity = entry.quantity ?? entry.qty ?? 1;
    }

    if (!id || !productsById[id]) {
      return;
    }

    const nextQuantity = normalizeQuantity(quantity);
    const existingQty = merged.get(id) ?? 0;
    merged.set(id, existingQty + nextQuantity);
  });

  return Array.from(merged.entries()).map(([id, quantity]) => ({ id, quantity }));
};

const normalizeWishlist = (
  rawWishlist,
  productsById,
  nameToId,
  { fallbackToDefault = false, defaultWishlistIds = [] } = {}
) => {
  if (!Array.isArray(rawWishlist)) {
    return fallbackToDefault ? [...defaultWishlistIds] : [];
  }

  const ids = rawWishlist
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }

      if (entry?.id) {
        return entry.id;
      }

      if (typeof entry?.name === 'string') {
        return nameToId.get(entry.name.toLowerCase());
      }

      return undefined;
    })
    .filter((id) => Boolean(id) && Boolean(productsById[id]));

  if (ids.length === 0) {
    return fallbackToDefault ? [...defaultWishlistIds] : [];
  }

  return Array.from(new Set(ids));
};

const readStorage = (key) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const { productsById, googleLoading } = useProductCatalog();

  const defaultWishlistIds = useMemo(
    () => wishlistDefaultIds.filter((id) => Boolean(productsById[id])),
    [productsById]
  );

  const nameToId = useMemo(
    () => new Map(Object.values(productsById).map((product) => [product.name.toLowerCase(), product.id])),
    [productsById]
  );

  const [cart, setCart] = useState(() => {
    const raw = readStorage(CART_STORAGE_KEY);
    if (!Array.isArray(raw)) return [];
    return raw.map((entry) => {
      if (typeof entry === 'string') return { id: entry, quantity: 1 };
      if (entry && typeof entry === 'object') {
        return { id: entry.id, quantity: entry.quantity ?? entry.qty ?? 1 };
      }
      return null;
    }).filter(Boolean);
  });

  const [wishlist, setWishlist] = useState(() => {
    const raw = readStorage(WISHLIST_STORAGE_KEY);
    return Array.isArray(raw) ? raw : [];
  });

  useEffect(() => {
    if (googleLoading) return;
    const normalizedCart = normalizeCart(cart, productsById, nameToId);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedCart));
  }, [cart, productsById, nameToId, googleLoading]);

  useEffect(() => {
    if (googleLoading) return;
    const normalizedWishlist = normalizeWishlist(wishlist, productsById, nameToId, {
      fallbackToDefault: false
    });
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(normalizedWishlist));
  }, [wishlist, productsById, nameToId, googleLoading]);

  const cartItems = useMemo(
    () =>
      cart
        .map((entry) => {
          const product = productsById[entry.id];
          if (!product) {
            return null;
          }

          return {
            ...entry,
            product
          };
        })
        .filter(Boolean),
    [cart, productsById]
  );

  const wishlistItems = useMemo(
    () => wishlist.map((id) => productsById[id]).filter(Boolean),
    [wishlist, productsById]
  );

  const cartCount = useMemo(
    () => cart.length,
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const addToCart = (productId, quantity = 1) => {
    if (!productsById[productId]) {
      return;
    }

    const nextQuantity = normalizeQuantity(quantity);

    setCart((prevCart) => {
      const existing = prevCart.find((entry) => entry.id === productId);

      if (existing) {
        return prevCart.map((entry) =>
          entry.id === productId
            ? {
                ...entry,
                quantity: entry.quantity + nextQuantity
              }
            : entry
        );
      }

      return [...prevCart, { id: productId, quantity: nextQuantity }];
    });
  };

  const setCartQuantity = (productId, quantity) => {
    if (!productsById[productId]) {
      return;
    }

    const nextQuantity = Number(quantity);
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((entry) => entry.id !== productId));
      return;
    }

    setCart((prevCart) =>
      prevCart.map((entry) =>
        entry.id === productId
          ? {
              ...entry,
              quantity: Math.floor(nextQuantity)
            }
          : entry
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((entry) => entry.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    if (!productsById[productId]) {
      return;
    }

    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      }

      return [...prevWishlist, productId];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== productId));
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToCart,
    setCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
    isWishlisted
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error('useShop must be used inside ShopProvider');
  }

  return context;
};
