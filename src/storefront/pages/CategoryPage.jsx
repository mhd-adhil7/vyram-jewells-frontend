import { useState, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useProductCatalog } from '../context/ProductCatalogContext';

const normalizeCategory = (value) =>
  String(value || "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

const categoryDescriptions = {
  'necklaces': 'Explore our exquisite handcrafted necklaces designed for timeless beauty.',
  'haram': 'Explore our traditional haram collections crafted with ultimate precision.',
  'earrings': 'Discover beautiful gold, diamond, and kundan earrings.',
  'ear-accessories': 'Enhance your look with elegant ear accessories.',
  'tikkas': 'Complete your traditional attire with our gorgeous maang tikkas.',
  'nose-pins': 'Sleek, beautiful, and delicate nose pins for every occasion.',
  'bangles': 'Intricately designed bangles to grace your wrists.',
  'hip-chains': 'Stunning hip chains to complete your bridal and ethnic look.',
  'rings': 'Elegant rings celebrating timeless design and shine.',
  'hair-accessories': 'Premium hair accessories for bridal and festive styles.',
  'anklets': 'Traditional and modern anklets to beautify your steps.',
  'bridal-sets': 'Celebrate your special day with our featured bridal collections.'
};

const CategoryPage = () => {
  const { products, googleLoading, googleError, fetchNecklaces } = useProductCatalog();
  const { categorySlug } = useParams();

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const isCategoryValid = useMemo(() => {
    if (googleLoading) return true;
    return products.some((p) => normalizeCategory(p.category) === normalizeCategory(categorySlug));
  }, [products, categorySlug, googleLoading]);

  const categoryLabel = useMemo(() => {
    const matchedProduct = products.find((p) => normalizeCategory(p.category) === normalizeCategory(categorySlug));
    if (matchedProduct) {
      return matchedProduct.category;
    }
    return categorySlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [products, categorySlug]);

  const categoryDescription = useMemo(() => {
    return (
      categoryDescriptions[categorySlug] ||
      `Explore our exquisite collection of ${categoryLabel} crafted with precision and elegance.`
    );
  }, [categorySlug, categoryLabel]);

  const categoryProducts = useMemo(() => {
    return products.filter((product) => normalizeCategory(product.category) === normalizeCategory(categorySlug));
  }, [products, categorySlug]);

  if (!googleLoading && !isCategoryValid) {
    return <Navigate to="/collections" replace />;
  }

  let pageContent;
  if (googleLoading) {
    pageContent = (
      <div className="empty-wishlist-state reveal-on-scroll" style={{ margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
        <div className="empty-wishlist-icon">
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--color-primary-light)' }}></i>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '15px' }}>Loading Collection</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-sub)' }}>
          Loading our exquisite collection for you...
        </p>
      </div>
    );
  } else if (googleError) {
    pageContent = (
      <div className="empty-wishlist-state reveal-on-scroll" style={{ margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
        <div className="empty-wishlist-icon">
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '3rem', color: 'var(--color-primary-light)' }}></i>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '15px' }}>Connection Error</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-sub)', marginBottom: '35px' }}>
          We were unable to load the collection. Please check your connection and try again.
        </p>
        <button onClick={fetchNecklaces} className="btn btn-primary explore-btn" style={{ cursor: 'pointer', border: 'none' }}>
          Retry Connection
        </button>
      </div>
    );
  } else if (categoryProducts.length > 0) {
    pageContent = (
      <div className="product-grid">
        {categoryProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            showQuickView
            onQuickView={openQuickView}
            className="reveal-on-scroll"
            style={{ transitionDelay: `${(index % 4) * 0.1 + 0.1}s` }}
          />
        ))}
      </div>
    );
  } else {
    pageContent = (
      <div className="empty-wishlist-state reveal-on-scroll" style={{ margin: '40px auto', maxWidth: '600px' }}>
        <div className="empty-wishlist-icon">
          <i className="fa-regular fa-gem" style={{ fontSize: '3rem', color: 'var(--color-primary-light)' }}></i>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '15px' }}>Coming Soon</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-sub)', marginBottom: '35px' }}>
          We&apos;re preparing an exclusive collection for this category. New arrivals will be available soon.
        </p>
        <Link to="/collections" className="btn btn-primary explore-btn page-transition-link">
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="collections-hero">
        <div className="collections-hero-content reveal-on-scroll">
          <div className="wishlist-breadcrumb" style={{ marginBottom: '15px' }}>
            <Link to="/">Home</Link> <span>/</span> <Link to="/collections">Collections</Link> <span>/</span> <span className="current-crumb">{categoryLabel}</span>
          </div>
          <h1>{categoryLabel}</h1>
          <p>{categoryDescription}</p>
        </div>
        <div className="collections-hero-image">
          <img
            src={`/assets/cat-${categorySlug}.png`}
            alt={categoryLabel}
            onError={(e) => {
              e.target.src = '/assets/product-default.png';
            }}
          />
        </div>
      </section>

      <section className="main-collections" style={{ padding: '60px 5%' }}>
        {pageContent}
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default CategoryPage;
