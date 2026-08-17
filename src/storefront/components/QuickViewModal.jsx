import { useEffect } from 'react';

const QuickViewModal = ({ product, isOpen, onClose }) => {
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

  return (
    <div 
      className={`quick-view-overlay ${isOpen ? 'active' : ''}`} 
      onClick={(e) => {
        if (e.target.classList.contains('quick-view-overlay')) {
          onClose();
        }
      }}
    >
      <div className="quick-view-modal image-preview-modal">
        <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <div className="modal-image-container preview-only">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.src = '/assets/product-default.png';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
