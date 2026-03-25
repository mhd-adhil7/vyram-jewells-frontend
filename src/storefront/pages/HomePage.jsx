import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { bridalCollections, homeCollectionItems, homeNewArrivalIds } from '../data/catalog';
import { useProductCatalog } from '../context/ProductCatalogContext';

const HomePage = () => {
  const { products } = useProductCatalog();
  const newArrivals = products.slice(0, 10); // Show more items for carousel
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 0;
      carouselRef.current.scrollBy({ left: -(cardWidth + 30), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 0;
      carouselRef.current.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let intervalId;
    
    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (carousel && carousel.firstElementChild) {
          const cardWidth = carousel.firstElementChild.offsetWidth;
          const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
          
          if (carousel.scrollLeft >= maxScrollLeft - 10) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            carousel.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
          }
        }
      }, 4000); 
    };

    startAutoScroll();

    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => startAutoScroll();

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
              <img src="/assets/vyram-cover.jpg" alt="Bridal Saree Jewellery" />
            </div>

            <div className="image-wrapper top-left-img">
              <img
                src="/assets/vyram-cover.jpg"
                alt="Necklace Close up"
                style={{ objectPosition: 'top center' }}
              />
            </div>

            <div className="image-wrapper bottom-right-img">
              <img
                src="/assets/vyram-cover.jpg"
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
          {homeCollectionItems.map((item) => (
            <div key={item} className="collection-item reveal-on-scroll">
              <div className="circle-outline">
                <img src="/assets/vyram-cover.jpg" alt={item} />
              </div>
              <h3>{item.toUpperCase()}</h3>
            </div>
          ))}
        </div>

        <div className="section-btn">
          <Link to="/collections" className="btn-outline-rect page-transition-link">
            Explore More
          </Link>
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
                />
              ))}
            </div>

            <button type="button" className="carousel-arrow next" onClick={scrollRight} aria-label="Next Products">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
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
                  <img src="/assets/vyram-cover.jpg" alt={collection.title} />
                  <div className="overlay-text">{collection.title.toUpperCase()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
