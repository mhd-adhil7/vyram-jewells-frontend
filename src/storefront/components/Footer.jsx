import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!subscribed) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setSubscribed(false);
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [subscribed]);

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setSubscribed(true);
    event.currentTarget.reset();
  };

  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h2 className="newsletter-heading">Stay Connected with Elegance</h2>
            <p className="newsletter-subtitle">
              Join our exclusive mailing list for the latest collections and insider benefits.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn-subscribe">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Link to="/">
                <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
              </Link>
            </div>
            <p className="brand-desc">
              Exquisite handcrafted jewelry designed to illuminate your life's most precious
              moments with timeless elegance.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" aria-label="Pinterest">
                <i className="fa-brands fa-pinterest"></i>
              </a>
              <a href="#" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="col-heading">Collections</h3>
            <ul className="footer-links">
              <li>
                <Link to="/bridal">Bridal Collection</Link>
              </li>
              <li>
                <Link to="/collections">Trending Jewellery</Link>
              </li>
              <li>
                <a href="#">Necklaces</a>
              </li>
              <li>
                <a href="#">Earrings</a>
              </li>
              <li>
                <a href="#">Bangles</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="col-heading">Customer Support</h3>
            <ul className="footer-links">
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <a href="#">Order Tracking</a>
              </li>
              <li>
                <a href="#">Shipping & Returns</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Care Guide</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="col-heading">Store Info</h3>
            <ul className="footer-info">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>123 Elegance Avenue, Luxury District, NY 10001</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>+1 (800) 123-4567</span>
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                <span>support@vyramjewells.com</span>
              </li>
              <li>
                <i className="fa-regular fa-clock"></i>
                <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-bar-content">
            <p className="copyright">&copy; 2026 Vyram Jewells. All Rights Reserved.</p>
            <div className="bottom-links">
              <a href="#">Privacy Policy</a>
              <span className="divider">|</span>
              <a href="#">Terms</a>
              <span className="divider">|</span>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
