import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { bridalCollections, bridalFavoriteIds } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const bridalCategories = [
  'Bridal Necklace Sets',
  'Temple Bridal',
  'Traditional Gold',
  'Diamond Bridal',
  'Kerala Edit'
];

const BridalPage = () => {
  const { productsById } = useProductCatalog();
  const favoriteProducts = bridalFavoriteIds.map((id) => productsById[id]).filter(Boolean);

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
          <img src="/assets/bridal-default.png" alt="Bridal Jewellery" />
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
              className="reveal-on-scroll"
              style={{ transitionDelay: `${(index % 4) * 0.1 + 0.1}s` }}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default BridalPage;
