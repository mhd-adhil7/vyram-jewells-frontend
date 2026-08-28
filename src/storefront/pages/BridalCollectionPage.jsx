import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useProductCatalog } from '../context/ProductCatalogContext';
import keralaBridalImg from '../../assets/bridal/Kerala bridal.jpg';
import antiqueBrideImg from '../../assets/bridal/Antique bride.jpg';
import trendingImg from '../../assets/bridal/Trending.jpg';
import budgetFriendlyImg from '../../assets/bridal/Budget friendly.jpg';
import premiumSetsImg from '../../assets/bridal/Premium sets.jpg';

const collectionDetails = {
  'kerala': {
    name: 'Kerala Bridal Collection',
    image: keralaBridalImg,
    description: 'Traditional Kerala bridal jewellery, featuring classic motifs and timeless designs.'
  },
  'antique': {
    name: 'Antique Bridal Collection',
    image: antiqueBrideImg,
    description: 'Heritage-inspired antique bridal sets crafted with exquisite detailing.'
  },
  'trending': {
    name: 'Trending Bridal Collection',
    image: trendingImg,
    description: 'Modern, high-fashion bridal designs currently in trend.'
  },
  'budget': {
    name: 'Budget Friendly Collection',
    image: budgetFriendlyImg,
    description: 'Affordable yet stunning bridal jewellery sets for your special day.'
  },
  'premium': {
    name: 'Premium Sets Collection',
    image: premiumSetsImg,
    description: 'Exclusive and luxurious premium bridal sets for an opulent look.'
  }
};

const normalizeName = (name) => {
  return String(name || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

const BridalCollectionPage = () => {
  const { products, googleLoading, googleError, fetchNecklaces } = useProductCatalog();
  const { collectionSlug } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        el.classList.add('visible');
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [collectionSlug, products]);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const details = useMemo(() => {
    return collectionDetails[collectionSlug.toLowerCase()] || {
      name: 'Bridal Collection',
      image: '/assets/bridal-default.png',
      description: 'Discover our exquisite range of bridal collections.'
    };
  }, [collectionSlug]);

  const filteredProducts = useMemo(() => {
    const targetCollectionNorm = normalizeName(details.name);
    return products.filter((product) => {
      // Must match category "Bridal Sets" (or "bridal")
      const catNorm = normalizeName(product.category);
      const isBridal = catNorm === 'bridal sets' || catNorm === 'bridal';
      if (!isBridal) return false;

      // Must match collection name
      const colNorm = normalizeName(product.collection);
      return colNorm === targetCollectionNorm;
    });
  }, [products, details.name]);

  let pageContent;
  if (googleLoading) {
    pageContent = (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p>Loading Products...</p>
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
        <button onClick={() => fetchNecklaces(true)} className="btn btn-primary explore-btn" style={{ cursor: 'pointer', border: 'none' }}>
          Retry Connection
        </button>
      </div>
    );
  } else if (filteredProducts.length > 0) {
    pageContent = (
      <div className="product-grid">
        {filteredProducts.map((product, index) => (
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
        <Link to="/bridal" className="btn btn-primary explore-btn page-transition-link">
          Back to Bridal Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="collections-hero">
        <div className="collections-hero-content reveal-on-scroll">
          <div className="wishlist-breadcrumb" style={{ marginBottom: '15px' }}>
            <Link to="/">Home</Link> <span>/</span> <Link to="/bridal">Bridal Collections</Link> <span>/</span> <span className="current-crumb">{details.name}</span>
          </div>
          <h1>{details.name}</h1>
          <p>{details.description}</p>
        </div>
        <div className="collections-hero-image">
          <img
            src={details.image}
            alt={details.name}
            onError={(e) => {
              e.target.src = '/assets/product-default.png';
            }}
          />
        </div>
      </section>

      <section className="main-collections" style={{ padding: '60px 5%' }}>
        {pageContent}
      </section>

      <section className="rental-terms-section reveal-on-scroll">
        <div className="rental-terms-container-minimal">
          <div className="section-title" style={{ marginBottom: '40px' }}>
            <h2>RENTAL TERMS & CONDITIONS</h2>
            <div className="title-line">
              <span></span>
            </div>
          </div>
          
          <div className="rental-terms-list-minimal">
            <div className="rental-term-row">
              <span className="term-num-minimal">01</span>
              <p>At any cost, the <span className="highlight-text-subtle">advance payment</span> is not refundable.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">02</span>
              <p>For any damage refund claim, an <span className="highlight-text-subtle">opening/unboxing video</span> is compulsory.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">03</span>
              <p>The rental payment is final and <span className="highlight-text-subtle">non-refundable</span>.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">04</span>
              <p>The caution deposit is <span className="highlight-text-subtle">refundable</span>. The amount depends on the ornaments selected by the customer.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">05</span>
              <p>Your booking will be confirmed only after the <span className="highlight-text-subtle">advance payment</span> is received.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">06</span>
              <p>The normal rental period is <span className="highlight-text-subtle">4 to 5 days</span>. If the ornaments are returned late, <span className="highlight-text-subtle">₹500 per day</span> will be deducted from the caution deposit.</p>
            </div>
            <div className="rental-term-row">
              <span className="term-num-minimal">07</span>
              <p>The rental amount cannot be refunded whether the ornaments have been used or not. This is the final decision.</p>
            </div>
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default BridalCollectionPage;
