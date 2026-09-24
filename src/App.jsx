import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './admin/components/AdminLayout';
import RequireAdminAuth from './admin/components/RequireAdminAuth';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import StoreLayout from './storefront/components/StoreLayout';
import { ProductCatalogProvider } from './storefront/context/ProductCatalogContext';
import { ShopProvider } from './storefront/context/ShopContext';
import AboutPage from './storefront/pages/AboutPage';
import BridalCollectionPage from './storefront/pages/BridalCollectionPage';
import BridalPage from './storefront/pages/BridalPage';
import CartPage from './storefront/pages/CartPage';
import CategoryPage from './storefront/pages/CategoryPage';
import CollectionsPage from './storefront/pages/CollectionsPage';
import ContactPage from './storefront/pages/ContactPage';
import HomePage from './storefront/pages/HomePage';
import NotFoundPage from './storefront/pages/NotFoundPage';
import WishlistPage from './storefront/pages/WishlistPage';

const App = () => {
  return (
    <ProductCatalogProvider>
      <ShopProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route element={<RequireAdminAuth />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminProductsPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Route>

              {/* Public Storefront Routes */}
              <Route path="/" element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="collections/:categorySlug" element={<CategoryPage />} />
                <Route path="bridal" element={<BridalPage />} />
                <Route path="bridal/:collectionSlug" element={<BridalCollectionPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </ShopProvider>
    </ProductCatalogProvider>
  );
};

export default App;
