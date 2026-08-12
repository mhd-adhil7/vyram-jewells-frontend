import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { formatPrice, wishlistRecommendedIds } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';
import { useShop } from '../context/ShopContext';

const WishlistPage = () => {
  const { productsById } = useProductCatalog();
  const { addToCart, removeFromWishlist, wishlistItems } = useShop();
  const recommendedProducts = wishlistRecommendedIds.map((id) => productsById[id]).filter(Boolean);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const handleMoveToCart = (productId) => {
    addToCart(productId);
    removeFromWishlist(productId);
  };

  return (
    <main className="wishlist-page">
      <section className="wishlist-header reveal-on-scroll">
        <h1>Your Favorites</h1>
        <p>&quot;Save the jewellery you love for later.&quot;</p>
        <div className="wishlist-breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span className="current-crumb">Wishlist</span>
        </div>
      </section>

      <section className="wishlist-grid-section">
        <div className="wishlist-container">
          {wishlistItems.length > 0 ? (
            <div className="product-grid wishlist-grid">
              {wishlistItems.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card wishlist-card reveal-on-scroll"
                  style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/assets/product-default.png';
                      }}
                    />
                    <button
                      type="button"
                      className="wishlist-remove-btn"
                      title="Remove from wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                    >
                      <i className="fa-solid fa-heart pulse-heart"></i>
                    </button>
                    <button
                      type="button"
                      className="quick-view-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openQuickView(product);
                      }}
                    >
                      Quick View
                    </button>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">{formatPrice(product.price)}</p>
                    <button
                      type="button"
                      className="add-cart-btn btn-full-width-wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToCart(product.id);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-wishlist-state reveal-on-scroll">
              <div className="empty-wishlist-icon">
                <i className="fa-regular fa-heart"></i>
              </div>
              <h2>Your wishlist is empty.</h2>
              <p>Looks like you haven&apos;t added any elegant pieces to your favorites yet.</p>
              <Link to="/collections" className="btn btn-primary explore-btn page-transition-link">
                Explore Collections
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="recommended-section wishlist-recommended reveal-on-scroll">
        <div className="recommended-header section-title">
          <h2>YOU MIGHT LOVE THESE</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="product-grid list-recommended">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showQuickView
              onQuickView={openQuickView}
            />
          ))}
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </main>
  );
};

export default WishlistPage;
