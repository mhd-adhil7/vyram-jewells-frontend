import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import keralaBridalImg from '../../assets/bridal/Kerala bridal.jpg';
import antiqueBrideImg from '../../assets/bridal/Antique bride.jpg';
import trendingImg from '../../assets/bridal/Trending.jpg';
import budgetFriendlyImg from '../../assets/bridal/Budget friendly.jpg';
import premiumSetsImg from '../../assets/bridal/Premium sets.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';

const bridalCategories = [
  { name: 'Kerala Bridal Collection', image: keralaBridalImg, slug: 'kerala' },
  { name: 'Antique Bridal Collection', image: antiqueBrideImg, slug: 'antique' },
  { name: 'Trending Bridal Collection', image: trendingImg, slug: 'trending' },
  { name: 'Budget Friendly Collection', image: budgetFriendlyImg, slug: 'budget' },
  { name: 'Premium Sets Collection', image: premiumSetsImg, slug: 'premium' }
];

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
      <section className="collections-hero">
        <div className="collections-hero-content reveal-on-scroll">
          <h1>BRIDAL COLLECTIONS</h1>
          <p>
            A celebration of timeless traditions, heritage and bridal elegance.
          </p>
        </div>
        <div className="collections-hero-image">
          <img src={bridalHero} alt="Bridal Collections" />
        </div>
      </section>

      <section className="collections-section" style={{ padding: '80px 5%' }}>
        <div className="section-title reveal-on-scroll">
          <h2>EXPLORE OUR BRIDAL COLLECTIONS</h2>
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
    </>
  );
};

export default BridalPage;
