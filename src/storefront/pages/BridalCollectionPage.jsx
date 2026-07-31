import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { bridalCollections } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const BridalCollectionPage = () => {
  const { productsById } = useProductCatalog();
  const { collectionSlug } = useParams();
  const collection = bridalCollections.find((item) => item.slug === collectionSlug);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product) => {
    console.log('DEBUG: openQuickView called for product:', product);
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    console.log('DEBUG: closeQuickView called');
    setIsQuickViewOpen(false);
  };

  if (!collection) {
    return <Navigate to="/bridal" replace />;
  }

  const products = collection.productIds.map((id) => productsById[id]).filter(Boolean);

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
