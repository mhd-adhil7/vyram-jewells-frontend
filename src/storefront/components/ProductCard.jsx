import { useEffect, useState } from 'react';
import { formatPrice } from '../data/catalog';
import { useShop } from '../context/ShopContext';
import MobileImageLightbox from './MobileImageLightbox';

const ProductCard = ({ product, className = '', showQuickView = false, onQuickView, style }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const [justAdded, setJustAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!justAdded) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setJustAdded(false);
    }, 1300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [justAdded]);

  const handleAddToCart = () => {
    addToCart(product.id);
    setJustAdded(true);
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className={`product-card ${className}`.trim()}
      data-category={product.category}
      style={style}
    >
      <div 
        className="product-image-container"
        onClick={(event) => {
          if (window.innerWidth <= 600) {
            event.preventDefault();
            event.stopPropagation();
            setIsLightboxOpen(true);
          }
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/assets/product-default.png';
          }}
        />
        <button className="wishlist-btn" type="button" onClick={handleToggleWishlist}>
          <i className={isWishlisted(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>
        {showQuickView ? (
          <button
            type="button"
            className="quick-view-btn"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onQuickView?.(product);
            }}
          >
            Quick View
          </button>
        ) : null}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="add-cart-btn"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleAddToCart();
          }}
        >
          {justAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
      <MobileImageLightbox
        product={product}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
};

export default ProductCard;
