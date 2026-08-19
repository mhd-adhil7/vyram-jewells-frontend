import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog';
import { useShop } from '../context/ShopContext';

const WHATSAPP_NUMBER = '919605272671';

const CartPage = () => {
  const { cartCount, cartItems, cartSubtotal, removeFromCart, setCartQuantity } = useShop();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/collections');
    }
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    if (cartCount === 0) {
      window.alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const itemLines = cartItems
      .map((item, index) => {
        return `${index + 1}. ${item.product.name}\n   Quantity: ${item.quantity}\n   Price: ${formatPrice(
          item.product.price
        )}`;
      })
      .join('\n\n');

    const message = `Hello Vyram Jewells,\n\nI would like to place an order:\n\n${itemLines}\n\nTotal: ${formatPrice(
      cartSubtotal
    )}\n\nPlease confirm the order and availability.`;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    const whatsappUrl = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [cartCount, cartItems, cartSubtotal]);

  return (
    <div className="cart-page-overlay" onClick={handleClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-header-title-container">
            <h2>Your Cart</h2>
            <span className="cart-header-count">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={handleClose}
            aria-label="Close Cart"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartCount === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-container">
                <i className="fa-regular fa-gem"></i>
              </div>
              <h3>Your cart is empty</h3>
              <p>Explore our premium collections and add your favorite jewellery pieces.</p>
              <button
                type="button"
                className="cart-continue-btn"
                onClick={handleClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-drawer-item-card">
                  <div className="cart-drawer-item-image">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/assets/product-default.png';
                      }}
                    />
                  </div>
                  <div className="cart-drawer-item-details">
                    <h4 className="cart-drawer-item-name">{item.product.name}</h4>
                    <p className="cart-drawer-item-price">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="cart-drawer-item-actions-row">
                      <div className="cart-drawer-qty-selector">
                        <button
                          type="button"
                          className="cart-qty-btn minus"
                          onClick={() => setCartQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn plus"
                          onClick={() => setCartQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartCount > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-price">{formatPrice(cartSubtotal)}</span>
            </div>
            <button
              type="button"
              className="cart-checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
