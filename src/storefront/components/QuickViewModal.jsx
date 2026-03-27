import { useEffect } from 'react';
import { formatPrice } from '../data/catalog';
import { useShop } from '../context/ShopContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useShop();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product.id);
    onClose();
  };

  return (
    <div 
      className={`quick-view-overlay ${isOpen ? 'active' : ''}`} 
      onClick={(e) => {
        if (e.target.classList.contains('quick-view-overlay')) {
          onClose();
        }
      }}
    >
      <div className="quick-view-modal">
        <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <div className="modal-image-container">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="modal-details">
          <h3 className="modal-title">{product.name}</h3>
          <p className="modal-price">{formatPrice(product.price)}</p>
          <p className="modal-description">
            Experience the exquisite craftsmanship of the {product.name}. 
            A timeless piece designed to elevate your collection with its stunning details and premium quality.
          </p>
          <button type="button" className="modal-add-cart-btn" onClick={handleAddToCart}>
            <i className="fa-solid fa-cart-plus"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
