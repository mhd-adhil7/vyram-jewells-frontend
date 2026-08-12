import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useProductCatalog } from '../context/ProductCatalogContext';

const categoryMapping = {
  'necklaces': { label: 'Necklaces', productCategory: 'necklaces', description: 'Explore our exquisite handcrafted necklaces designed for timeless beauty.' },
  'haram': { label: 'Haram', productCategory: 'haram', description: 'Explore our traditional haram collections crafted with ultimate precision.' },
  'earrings': { label: 'Earrings', productCategory: 'earrings', description: 'Discover beautiful gold, diamond, and kundan earrings.' },
  'ear-accessories': { label: 'Ear Accessories', productCategory: 'ear-accessories', description: 'Enhance your look with elegant ear accessories.' },
  'tikkas': { label: 'Tikkas', productCategory: 'tikkas', description: 'Complete your traditional attire with our gorgeous maang tikkas.' },
  'nose-pins': { label: 'Nose Pins', productCategory: 'nose-pins', description: 'Sleek, beautiful, and delicate nose pins for every occasion.' },
  'bangles': { label: 'Bangles', productCategory: 'bangles', description: 'Intricately designed bangles to grace your wrists.' },
  'hip-chains': { label: 'Hip Chains', productCategory: 'hip-chains', description: 'Stunning hip chains to complete your bridal and ethnic look.' },
  'rings': { label: 'Rings', productCategory: 'rings', description: 'Elegant rings celebrating timeless design and shine.' },
  'hair-accessories': { label: 'Hair Accessories', productCategory: 'hair-accessories', description: 'Premium hair accessories for bridal and festive styles.' },
  'anklets': { label: 'Anklets', productCategory: 'anklets', description: 'Traditional and modern anklets to beautify your steps.' },
  'bridal-sets': { label: 'Bridal Sets', productCategory: 'bridal', description: 'Celebrate your special day with our featured bridal collections.' }
};

const CategoryPage = () => {
  const { products, googleLoading, googleError, fetchNecklaces } = useProductCatalog();
  const { categorySlug } = useParams();

  const category = categoryMapping[categorySlug];

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  if (!category) {
    return <Navigate to="/collections" replace />;
  }

  const categoryProducts = products.filter(
    (product) => product.category === category.productCategory
  );

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
            <Link to="/">Home</Link> <span>/</span> <Link to="/collections">Collections</Link> <span>/</span> <span className="current-crumb">{category.label}</span>
          </div>
          <h1>{category.label}</h1>
          <p>{category.description}</p>
        </div>
        <div className="collections-hero-image">
          <img
            src={`/assets/cat-${categorySlug}.png`}
            alt={category.label}
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
