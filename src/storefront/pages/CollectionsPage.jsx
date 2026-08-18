import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { bridalCollections } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const normalizeCategory = (value) =>
  String(value || "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

const CollectionsPage = () => {
  const { products, googleLoading, googleError, fetchNecklaces } = useProductCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const searchTerm = (searchParams.get('q') || '').trim().toLowerCase();

  const handleSearchChange = (event) => {
    const nextParams = new URLSearchParams(searchParams);
    if (event.target.value) {
      nextParams.set('q', event.target.value);
    } else {
      nextParams.delete('q');
    }
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    setSearchParams(nextParams);
  };

  const categories = useMemo(() => {
    const unique = [];
    const seen = new Set();
    products.forEach((product) => {
      if (product.category) {
        const cat = product.category.trim();
        const lower = cat.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          unique.push({
            slug: product.categorySlug,
            label: cat
          });
        }
      }
    });
    return unique;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeFilter !== 'all') {
        const normProductCat = normalizeCategory(product.category);
        const normActiveFilter = normalizeCategory(activeFilter);
        if (normProductCat !== normActiveFilter) {
          return false;
        }
      }

      if (!searchTerm) {
        return true;
      }

      const normalizedQuery = searchTerm
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');

      const searchableText = [
        product.name,
        product.search_keywords,
        product.category
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeFilter, products, searchTerm]);

  return (
    <>
      <section className="collections-hero">
        <div className="collections-hero-content reveal-on-scroll">
          <h1>Collections</h1>
          <p>Explore handcrafted jewellery designed for timeless beauty.</p>
          <div className="hero-actions">
            <Link to="/collections" className="btn btn-primary page-transition-link">
              View All Jewellery
            </Link>
            <Link to="/bridal" className="btn btn-secondary page-transition-link">
              Bridal Collection
            </Link>
          </div>
        </div>
        <div className="collections-hero-image">
          <img src="/assets/cat-necklaces.png" alt="Collections" />
        </div>
      </section>

      <section className="main-collections">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} className="reveal-on-scroll">
          <div className="search-bar" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-white)' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchParams.get('q') || ''}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="category-filter reveal-on-scroll">
          <button
            type="button"
            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              className={`filter-pill ${activeFilter === cat.slug ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.slug)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {searchTerm ? (
          <div className="search-results-header reveal-on-scroll" style={{ marginBottom: '30px', marginTop: '30px' }}>
            <p>
              Showing results for <span className="search-query-text">"{searchTerm}"</span>
            </p>
          </div>
        ) : null}

        {googleLoading ? (
          <div className="empty-wishlist-state reveal-on-scroll" style={{ margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
            <div className="empty-wishlist-icon">
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--color-primary-light)' }}></i>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '15px' }}>Loading Collection</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-sub)' }}>
              Loading our exquisite collections for you...
            </p>
          </div>
        ) : googleError ? (
          <div className="empty-wishlist-state reveal-on-scroll" style={{ margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
            <div className="empty-wishlist-icon">
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '3rem', color: 'var(--color-primary-light)' }}></i>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '15px' }}>Connection Error</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--color-text-sub)', marginBottom: '35px' }}>
              We were unable to load the collections. Please check your connection and try again.
            </p>
            <button onClick={fetchNecklaces} className="btn btn-primary explore-btn" style={{ cursor: 'pointer', border: 'none' }}>
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="no-results-container reveal-on-scroll" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-white)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(116, 139, 111, 0.03)', maxWidth: '500px', margin: '40px auto' }}>
                <p className="no-results-msg" style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', color: 'var(--color-text-sub)', marginBottom: '15px' }}>
                  {activeFilter !== 'all' ? 'No products found in this category' : 'No products found'}
                </p>
                <button 
                  type="button" 
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary-dark)',
                    textDecoration: 'underline',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
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
            )}
          </>
        )}

        {!googleLoading && !googleError && filteredProducts.length > 0 && (
          <div className="pagination reveal-on-scroll">
            <button type="button" className="page-btn prev-btn">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" className="page-num active">
              1
            </button>
            <button type="button" className="page-num">
              2
            </button>
            <button type="button" className="page-num">
              3
            </button>
            <button type="button" className="page-btn next-btn">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </section>

      <section className="bridal-section collections-bridal">
        <div className="section-title reveal-on-scroll">
          <h2>BRIDAL COLLECTION</h2>
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

      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default CollectionsPage;
