import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { cartRecommendedIds, formatPrice } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';
import { useShop } from '../context/ShopContext';

const WHATSAPP_NUMBER = '9744342857';

const CartPage = () => {
  const { productsById } = useProductCatalog();
  const { cartItems, cartSubtotal, removeFromCart, setCartQuantity } = useShop();

  const recommendedProducts = cartRecommendedIds.map((id) => productsById[id]).filter(Boolean);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      window.alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const itemLines = cartItems
      .map((item) => {
        return `Product: ${item.product.name}\nQuantity: ${item.qty}\nPrice: ${formatPrice(
          item.product.price
        )}`;
      })
      .join('\n\n');

    const message = `Hello, I would like to order the following jewellery items:\n\n${itemLines}\n\nTotal: ${formatPrice(
      cartSubtotal
    )}\n\nPlease assist me with the order.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>Review your selected jewellery pieces.</p>
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/collections">Collections</Link> <span>/</span>
          Cart
        </div>
      </div>

      <div className="cart-content-wrapper">
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <p
              className="empty-cart-msg"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--color-text-sub)',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              Your cart is currently empty.{' '}
              <Link
                to="/collections"
                style={{
                  color: 'var(--color-primary-dark)',
                  textDecoration: 'underline',
                  fontWeight: 500
                }}
              >
                Continue shopping
              </Link>
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-category">Jewellery</p>
                  <p className="cart-item-price" data-price={item.product.price}>
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button
                      type="button"
                      className="qty-btn qty-minus"
                      onClick={() => setCartQuantity(item.id, item.qty - 1)}
                    >
                      -
                    </button>
                    <input type="text" className="qty-input" value={item.qty} readOnly />
                    <button
                      type="button"
                      className="qty-btn qty-plus"
                      onClick={() => setCartQuantity(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary-container">
          <div className="cart-summary-card">
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="subtotal-val">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span>-$0</span>
            </div>
            <div className="summary-row total">
              <span>Total Price</span>
              <span className="price-val total-val">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="cart-summary-btns">
              <button type="button" className="btn-full-width btn-checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <Link to="/collections" className="btn-full-width btn-continue page-transition-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="recommended-section">
        <div className="recommended-header">
          <h2>You May Also Like</h2>
        </div>
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} showQuickView />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CartPage;
