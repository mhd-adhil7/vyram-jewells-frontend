import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProductCatalog } from '../context/ProductCatalogContext';

// Import local assets from src/assets
import banglesImg from '../../assets/bangles.jpg';
import earingImg from '../../assets/earing.jpg';
import haramImg from '../../assets/haram.jpg';
import bridalHeroImg from '../../assets/bridal-hero.jpg';
import necklacesImg from '../../assets/vyramheroimgae.jpeg';

const collectionImages = {
  'necklaces': necklacesImg,
  'bangles': banglesImg,
  'hair-accessories': bridalHeroImg,
  'haram': haramImg,
  'earrings': earingImg,
  'rings': banglesImg,
  'tikkas': bridalHeroImg
};

const CollectionsPage = () => {
  const { products } = useProductCatalog();

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

  return (
    <section className="collections-section" style={{ padding: '80px 5%' }}>
      <div className="section-title">
        <h2>COLLECTIONS</h2>
        <div className="title-line">
          <span></span>
        </div>
      </div>

      <div className="collections-grid">
        {categories.map((cat) => {
          return (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="collection-item reveal-on-scroll page-transition-link"
              style={{ textDecoration: 'none' }}
            >
              <div className="circle-outline">
                <img
                  src={collectionImages[cat.slug] || `/assets/cat-${cat.slug}.png`}
                  alt={cat.label}
                  onError={(e) => {
                    e.target.src = '/assets/product-default.png';
                  }}
                />
              </div>
              <h3>{cat.label.toUpperCase()}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CollectionsPage;
