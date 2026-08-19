import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { bridalCollections } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';
import bridalHero from '../../assets/bridal-hero.jpg';


const bridalCategories = [
  'Kerala Bridal Collection',
  'Antique Bridal Collection',
  'Trending Bridal Collection',
  'Budget Friendly Collection',
  'Premium Sets Collection'
];


const BridalPage = () => {
  const { products } = useProductCatalog();
  const favoriteProducts = useMemo(() => {
    const bridalList = products.filter(
      (p) =>
        p.category?.toLowerCase().includes('bridal') ||
        p.categorySlug?.includes('bridal')
    );
    return bridalList.length > 0 ? bridalList.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  return (
    <>
      <section className="bridal-page-hero">
        <div className="bridal-page-hero-content reveal-on-scroll">
          <h1>Bridal Jewellery Collection</h1>
          <div className="bridal-divider"></div>
          <p>
            Celebrate your most special day with timeless handcrafted bridal jewellery.
          </p>
          <div className="hero-actions">
            <Link to="/bridal" className="btn btn-primary page-transition-link">
              Explore Bridal Sets
            </Link>
            <Link to="/collections" className="btn btn-secondary page-transition-link">
              View Collections
            </Link>
          </div>
        </div>
        <div className="bridal-page-hero-image">
          <img src={bridalHero} alt="Bridal Jewellery" />
        </div>
      </section>

      <section className="collections-section" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="collections-grid">
          {bridalCategories.map((category, index) => (
            <div
              key={category}
              className="collection-item reveal-on-scroll"
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="circle-outline">
                <img src="/assets/bridal-default.png" alt={category} />
              </div>
              <h3>{category.toUpperCase()}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bridal-section">
        <div className="section-title reveal-on-scroll">
          <h2>FEATURED BRIDAL COLLECTIONS</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="bridal-grid">
          {bridalCollections.map((collection, index) => (
            <Link
              key={collection.slug}
              to={`/bridal/${collection.slug}`}
              className="bridal-item page-transition-link reveal-on-scroll"
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="arch-outline">
                <div className="arch-img">
                  <img src="/assets/bridal-default.png" alt={collection.title} />
                  <div className="overlay-text">{collection.title.toUpperCase()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="main-collections" style={{ paddingTop: '20px' }}>
        <div className="section-title reveal-on-scroll">
          <h2>BRIDE&apos;S FAVORITES</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>
        <div className="product-grid">
          {favoriteProducts.map((product, index) => (
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
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default BridalPage;
