import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './admin/components/AdminLayout';
import RequireAdminAuth from './admin/components/RequireAdminAuth';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage';
import AdminCustomersPage from './admin/pages/AdminCustomersPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminMessagesPage from './admin/pages/AdminMessagesPage';
import AdminOrdersPage from './admin/pages/AdminOrdersPage';
import AdminProductsPage from './admin/pages/AdminProductsPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import StoreLayout from './storefront/components/StoreLayout';
import { ProductCatalogProvider } from './storefront/context/ProductCatalogContext';
import { ShopProvider } from './storefront/context/ShopContext';
import AboutPage from './storefront/pages/AboutPage';
import BridalCollectionPage from './storefront/pages/BridalCollectionPage';
import BridalPage from './storefront/pages/BridalPage';
import CartPage from './storefront/pages/CartPage';
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
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route element={<RequireAdminAuth />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Route>

              <Route path="/" element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="collections" element={<CollectionsPage />} />
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
