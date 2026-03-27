import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import {
  bridalCollections,
  categoryLabels,
  collectionFilters
} from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const CollectionsPage = () => {
  const { products } = useProductCatalog();
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeFilter !== 'all' && product.category !== activeFilter) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      return product.name.toLowerCase().includes(searchTerm);
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
          <img src="/assets/vyram-cover.jpg" alt="Collections" />
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
          {collectionFilters.map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={`filter-pill ${activeFilter === filterKey ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterKey)}
            >
              {categoryLabels[filterKey]}
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

        {filteredProducts.length === 0 ? (
          <p className="no-results-msg">No jewellery found matching your search.</p>
        ) : null}

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
                  <img src="/assets/vyram-cover.jpg" alt={collection.title} />
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
