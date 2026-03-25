import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useShop } from '../context/ShopContext';

const secondaryNavItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/collections', label: 'Collections' },
  { to: '/bridal', label: 'Bridal' },
  { to: '/contact', label: 'Contact' }
];

const StoreLayout = () => {
  const { cartCount, wishlistCount } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .fade-in-on-scroll');
    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    setMobileMenuOpen(false);

    if (query) {
      navigate(`/collections?q=${encodeURIComponent(query)}`);
      return;
    }

    navigate('/collections');
  };

  return (
    <>
      <div className="top-bar">Welcome to our store</div>

      <header className="main-header">
        <button
          type="button"
          className="hamburger-menu"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <div className="header-left">
          <Link
            to="/collections"
            className="nav-pill page-transition-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trending Jewellery
          </Link>
          <Link
            to="/bridal"
            className="nav-text page-transition-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Bridal Collection
          </Link>
        </div>

        <div className="header-logo">
          <Link to="/" className="page-transition-link" onClick={() => setMobileMenuOpen(false)}>
            <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
          </Link>
        </div>

        <div className="header-right">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search jewellery..."
            />
          </form>
          <div className="header-icons">
            <Link
              to="/wishlist"
              className="page-transition-link"
              aria-label="Wishlist"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fa-regular fa-heart"></i>
              {wishlistCount > 0 ? <span className="cart-count">{wishlistCount}</span> : null}
            </Link>
            <Link
              to="/cart"
              className="cart-icon page-transition-link"
              aria-label="Cart"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span className="cart-count">{cartCount}</span>
            </Link>
            <a href="#" aria-label="Account">
              <i className="fa-regular fa-user"></i>
            </a>
          </div>
        </div>
      </header>

      <nav className={`secondary-nav-container ${mobileMenuOpen ? 'active' : ''}`}>
        <ul className="secondary-nav">
          {secondaryNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'active page-transition-link' : 'page-transition-link'
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>

      <Outlet />

      <Footer />

      <div className="sticky-socials">
        <a href="#" className="social-icon" aria-label="Instagram">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a href="#" className="social-icon" aria-label="WhatsApp">
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        <a href="#" className="social-icon" aria-label="Facebook">
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a href="#" className="social-icon" aria-label="Phone">
          <i className="fa-solid fa-phone"></i>
        </a>
      </div>
    </>
  );
};

export default StoreLayout;
