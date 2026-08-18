import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const MobileImageLightbox = ({ product, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Store the exact scroll position before locking
      const scrollY = window.scrollY;
      
      // Prevent background scrolling while open
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore background scroll and previous scroll position when closed
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    // Close lightbox only when clicking direct backdrop element (or outer wrapper)
    if (
      e.target.classList.contains('mobile-lightbox-overlay') || 
      e.target.classList.contains('mobile-lightbox-content')
    ) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={`mobile-lightbox-overlay ${isOpen ? 'active' : ''}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        className="mobile-lightbox-close"
        onClick={onClose}
        aria-label="Close image lightbox"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div className="mobile-lightbox-content">
        <img
          src={product.image}
          alt={product.name}
          className="mobile-lightbox-img"
          onError={(e) => {
            e.target.src = '/assets/product-default.png';
          }}
        />
      </div>
    </div>,
    document.body
  );
};

export default MobileImageLightbox;
