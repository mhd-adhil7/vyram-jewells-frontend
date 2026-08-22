import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bridalCollections } from '../data/catalog';
import bridalHero from '../../assets/bridal-hero.jpg';

const BridalPage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        el.classList.add('visible');
      });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="bridal-page-hero">
        <div className="bridal-page-hero-content reveal-on-scroll">
          <h1>BRIDAL GALLERY</h1>
          <div className="bridal-divider"></div>
          <p>
            A celebration of timeless traditions, heritage and bridal elegance.
          </p>
        </div>
        <div className="bridal-page-hero-image">
          <img src={bridalHero} alt="Bridal Gallery" />
        </div>
      </section>

      <section className="bridal-section" style={{ padding: '80px 5%' }}>
        <div className="section-title reveal-on-scroll">
          <h2>FEATURED BRIDAL COLLECTIONS</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="bridal-grid three-cols">
          {bridalCollections.map((collection, index) => (
            <Link
              key={collection.slug}
              to={`/bridal/${collection.slug}`}
              className="bridal-item page-transition-link reveal-on-scroll"
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="arch-outline">
                <div className="arch-img">
                  <img src={collection.image} alt={collection.title} />
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

export default BridalPage;
