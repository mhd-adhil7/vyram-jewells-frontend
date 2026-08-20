import { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { bridalCollections } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';
import bridalHero from '../../assets/bridal-hero.jpg';
import keralaBridalImg from '../../assets/bridal/Kerala bridal.jpg';
import antiqueBrideImg from '../../assets/bridal/Antique bride.jpg';
import trendingImg from '../../assets/bridal/Trending.jpg';
import budgetFriendlyImg from '../../assets/bridal/Budget friendly.jpg';
import premiumSetsImg from '../../assets/bridal/Premium sets.jpg';


const bridalCategories = [
  { name: 'Kerala Bridal Collection', image: keralaBridalImg, slug: 'kerala' },
  { name: 'Antique Bridal Collection', image: antiqueBrideImg, slug: 'antique' },
  { name: 'Trending Bridal Collection', image: trendingImg, slug: 'trending' },
  { name: 'Budget Friendly Collection', image: budgetFriendlyImg, slug: 'budget' },
  { name: 'Premium Sets Collection', image: premiumSetsImg, slug: 'premium' }
];


const BridalPage = () => {
  const { products } = useProductCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCollectionSlug = searchParams.get('collection') || 'all';

  const handleCollectionSelect = (slug) => {
    if (selectedCollectionSlug === slug) {
      setSearchParams({});
    } else {
      setSearchParams({ collection: slug });
    }
  };

  const filteredProducts = useMemo(() => {
    const bridalList = products.filter(
      (p) =>
        p.category?.toLowerCase().includes('bridal') ||
        p.categorySlug?.includes('bridal')
    );

    if (selectedCollectionSlug === 'kerala') {
      return bridalList.filter(p => {
        const text = `${p.name} ${p.category} ${p.searchKeywords || ''}`.toLowerCase();
        return text.includes('kerala') || text.includes('palakka') || text.includes('nagapada') || text.includes('manga') || text.includes('kasavu');
      });
    }
    if (selectedCollectionSlug === 'antique') {
      return bridalList.filter(p => {
        const text = `${p.name} ${p.category} ${p.searchKeywords || ''}`.toLowerCase();
        return text.includes('antique') || text.includes('heritage') || text.includes('traditional') || text.includes('temple');
      });
    }
    if (selectedCollectionSlug === 'trending') {
      return bridalList.filter(p => {
        const text = `${p.name} ${p.category} ${p.searchKeywords || ''}`.toLowerCase();
        return text.includes('trending') || text.includes('modern') || text.includes('polki') || text.includes('kundan') || text.includes('solitaire') || text.includes('diamond');
      });
    }
    if (selectedCollectionSlug === 'budget') {
      return bridalList.filter(p => p.price < 2000);
    }
    if (selectedCollectionSlug === 'premium') {
      return bridalList.filter(p => p.price >= 2000);
    }

    return bridalList.length > 0 ? bridalList.slice(0, 6) : products.slice(0, 6);
  }, [products, selectedCollectionSlug]);

  const activeCollectionName = useMemo(() => {
    if (selectedCollectionSlug === 'all') return "BRIDE'S FAVORITES";
    const cat = bridalCategories.find(c => c.slug === selectedCollectionSlug);
    return cat ? cat.name.toUpperCase() : "BRIDE'S FAVORITES";
  }, [selectedCollectionSlug]);

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
              key={category.name}
              className="collection-item reveal-on-scroll"
              style={{ transitionDelay: `${(index + 1) * 0.1}s`, cursor: 'pointer' }}
              onClick={() => handleCollectionSelect(category.slug)}
            >
              <div 
                className="circle-outline"
                style={
                  selectedCollectionSlug === category.slug 
                    ? { borderWidth: '2.5px', borderColor: 'var(--color-primary-dark)', padding: '2px', transform: 'scale(1.05)', boxShadow: '0 4px 15px rgba(110, 130, 108, 0.3)' } 
                    : {}
                }
              >
                <img src={category.image} alt={category.name} />
              </div>
              <h3 style={selectedCollectionSlug === category.slug ? { fontWeight: '700', color: 'var(--color-primary-dark)' } : {}}>{category.name.toUpperCase()}</h3>
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
          <h2>{activeCollectionName}</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>
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
