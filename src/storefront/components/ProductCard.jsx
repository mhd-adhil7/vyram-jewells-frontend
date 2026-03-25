import { useEffect, useState } from 'react';
import { formatPrice } from '../data/catalog';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product, className = '', showQuickView = false, onQuickView, style }) => {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const [justAdded, setJustAdded] = useState(false);

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
    toggleWishlist(product.id);
  };

  return (
    <div
      className={`product-card ${className}`.trim()}
      data-category={product.category}
      style={style}
    >
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />
        <button className="wishlist-btn" type="button" onClick={handleToggleWishlist}>
          <i className={isWishlisted(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
        </button>
        {showQuickView ? (
          <button type="button" className="quick-view-btn" onClick={() => onQuickView?.(product)}>
            Quick View
          </button>
        ) : null}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>
        <button type="button" className="add-cart-btn" onClick={handleAddToCart}>
          {justAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
