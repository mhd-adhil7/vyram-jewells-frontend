import { useState, useMemo, useCallback } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { bridalCollections } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const BridalCollectionPage = () => {
  const { products: allProducts } = useProductCatalog();
  const { collectionSlug } = useParams();
  const collection = bridalCollections.find((item) => item.slug === collectionSlug);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const products = useMemo(() => {
    if (!collection) return [];
    return allProducts.filter((p) => {
      if (collection.productIds.includes(p.id)) {
        return true;
      }

      const text = `${p.name} ${p.category} ${p.searchKeywords || ''}`.toLowerCase();
      if (collectionSlug === 'kerala') {
        return (
          text.includes('kerala') ||
          text.includes('palakka') ||
          text.includes('mullamott') ||
          text.includes('kasavu') ||
          text.includes('nagapada') ||
          text.includes('manga') ||
          text.includes('mala')
        );
      }
      if (collectionSlug === 'royal-temple') {
        return (
          text.includes('temple') ||
          text.includes('lakshmi') ||
          text.includes('peacock') ||
          text.includes('vanki') ||
          text.includes('jhumka') ||
          text.includes('divine')
        );
      }
      if (collectionSlug === 'classic-gold') {
        return (
          text.includes('gold') ||
          text.includes('antique') ||
          text.includes('haar') ||
          text.includes('tikka') ||
          text.includes('kada') ||
          text.includes('traditional')
        );
      }
      if (collectionSlug === 'diamond') {
        return (
          text.includes('diamond') ||
          text.includes('solitaire') ||
          text.includes('platinum') ||
          text.includes('tennis')
        );
      }
      return false;
    });
  }, [allProducts, collection, collectionSlug]);

  if (!collection) {
    return <Navigate to="/bridal" replace />;
  }

  return (
    <>
      <section className="bridal-page-hero">
        <div className="bridal-page-hero-content reveal-on-scroll">
          <h1>{collection.title}</h1>
          <div className="bridal-divider"></div>
          <p>{collection.description}</p>
        </div>
        <div className="bridal-page-hero-image">
          <img src="/assets/bridal-default.png" alt={collection.title} />
        </div>
      </section>

      <section className="main-collections" style={{ paddingTop: '50px' }}>
        <div className="section-title reveal-on-scroll">
          <h2>{collection.title.toUpperCase()}</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              showQuickView
              onQuickView={openQuickView}
              className="reveal-on-scroll"
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
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

export default BridalCollectionPage;
