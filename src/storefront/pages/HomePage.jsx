import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useProductCatalog } from '../context/ProductCatalogContext';
import vyramHeroImg from '../../assets/vyramheroimgae.jpeg';
import banglesImg from '../../assets/bangles.jpg';
import earingImg from '../../assets/earing.jpg';
import haramImg from '../../assets/haram.jpg';
import bridalHeroImg from '../../assets/bridal-hero.jpg';
import necklacesImg from '../../assets/Necklaces.jpg';
import hairAccessoriesImg from '../../assets/Hair accessories.jpg';
import ringsImg from '../../assets/Rings.jpg';
import hipChainsImg from '../../assets/Hip chain.jpg';
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


const collectionImages = {
  'necklaces': necklacesImg,
  'bangles': banglesImg,
  'hair-accessories': hairAccessoriesImg,
  'haram': haramImg,
  'earrings': earingImg,
  'rings': ringsImg,
  'tikkas': bridalHeroImg,
  'hip-chains': hipChainsImg,
  'bridal': vyramHeroImg,
  'bridal-sets': vyramHeroImg
};

const HomePage = () => {
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

  const newArrivals = products.slice(0, 10); // Show more items for carousel
  const carouselRef = useRef(null);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 0;
      carouselRef.current.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 0;
      carouselRef.current.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = carousel;
      if (scrollWidth > clientWidth) {
        const widthPercent = (clientWidth / scrollWidth) * 100;
        const maxScroll = scrollWidth - clientWidth;
        const leftPercent = (scrollLeft / maxScroll) * (100 - widthPercent);
        setThumbWidth(widthPercent);
        setScrollRatio(leftPercent);
      } else {
        setThumbWidth(0);
        setScrollRatio(0);
      }
    };

    updateScroll();

    carousel.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    const resizeObserver = new ResizeObserver(updateScroll);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      resizeObserver.disconnect();
    };
  }, [products]);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Timeless Jewellery
            <br />
            for Every Occasion
          </h1>
          <p>
            Discover handcrafted luxury pieces designed to shine forever.
            <br />
            Each piece tells a unique story of elegance and craftsmanship.
          </p>
          <div className="hero-actions">
            <Link to="/collections" className="btn btn-primary page-transition-link">
              Shop Collection
            </Link>
            <Link to="/bridal" className="btn btn-secondary page-transition-link">
              Explore Bridal
            </Link>
          </div>
        </div>

        <div className="hero-images-container">
          <div className="hero-images-scale">
            <div className="outline-pill"></div>

            <div className="outline-line top-line">
              <div className="dot left-dot"></div>
            </div>

            <div className="outline-line bot-line">
              <div className="dot left-dot"></div>
            </div>

            <div className="image-wrapper main-img">
              <img src={vyramHeroImg} alt="" />
            </div>

            <div className="image-wrapper top-left-img">
              <img
                src={necklacesImg}
                alt="Necklace Close up"
                style={{ objectPosition: 'top center' }}
              />
            </div>

            <div className="image-wrapper bottom-right-img">
              <img
                src={earingImg}
                alt="Earring Close up"
                style={{ objectPosition: 'bottom right' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="collections-section">
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

      <section className="collections-section" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="section-title">
          <h2>BRIDAL COLLECTIONS</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="collections-grid">
          {bridalCategories.map((cat, index) => {
            return (
              <Link
                key={cat.slug}
                to={`/bridal/${cat.slug}`}
                className="collection-item reveal-on-scroll page-transition-link"
                style={{ textDecoration: 'none', transitionDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="circle-outline">
                  <img
                    src={cat.image}
                    alt={cat.name}
                  />
                </div>
                <h3>{cat.name.toUpperCase()}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="new-arrivals-wrapper fade-in-on-scroll">
        <div className="new-arrivals-section">
          <div className="section-title">
            <h2>New Arrivals</h2>
            <div className="title-line">
              <span></span>
            </div>
            <p className="subtitle">Discover our latest handcrafted jewellery pieces</p>
          </div>

          <div className="new-arrivals-carousel-container">
            <button type="button" className="carousel-arrow prev" onClick={scrollLeft} aria-label="Previous Products">
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="new-arrivals-carousel" ref={carouselRef}>
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="new-arrival-item"
                  showQuickView
                  onQuickView={openQuickView}
                />
              ))}
            </div>

            <button type="button" className="carousel-arrow next" onClick={scrollRight} aria-label="Next Products">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {thumbWidth > 0 && thumbWidth < 100 && (
            <div className="mobile-carousel-indicator-bar">
              <div 
                className="mobile-carousel-indicator-progress" 
                style={{ 
                  width: `${thumbWidth}%`,
                  left: `${scrollRatio}%`
                }}
              />
            </div>
          )}
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

export default HomePage;
