import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
        <BrowserRouter>
          <Routes>
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
      </ShopProvider>
    </ProductCatalogProvider>
  );
};

export default App;
