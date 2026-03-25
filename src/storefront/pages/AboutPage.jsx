const AboutPage = () => {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-bg">
          <img src="/assets/vyram-cover.jpg" alt="Elegance" />
          <div className="about-hero-overlay"></div>
        </div>
        <div className="about-hero-content">
          <h1>Our Story of Elegance</h1>
          <p>
            Crafting timeless masterpieces with passion, precision, and an unwavering commitment
            to luxury.
          </p>
        </div>
      </section>

      <section className="brand-story">
        <div className="story-container reveal-on-scroll">
          <div className="story-image">
            <img src="/assets/vyram-cover.jpg" alt="Jewellery Craftsmanship" />
          </div>
          <div className="story-content">
            <h2>Crafted with Passion</h2>
            <div className="story-divider"></div>
            <p>
              Since our inception, Vyram Jewells has been driven by a profound passion for
              exquisite craftsmanship. We believe that jewellery is more than just an adornment;
              it is a timeless expression of art, emotion, and heritage.
            </p>
            <p>
              Every gem is carefully selected and every curve meticulously designed, ensuring each
              creation reflects our dedication to quality, timeless design, and authentic beauty.
            </p>
          </div>
        </div>
      </section>

      <section className="our-values">
        <div className="section-title">
          <h2>OUR VALUES</h2>
          <div className="title-line">
            <span></span>
          </div>
        </div>

        <div className="values-grid">
          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="value-icon">
              <i className="fa-solid fa-gem"></i>
            </div>
            <h3>Premium Craftsmanship</h3>
            <p>
              Every piece is uniquely handcrafted by master artisans with meticulous attention to
              detail.
            </p>
          </div>

          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
            <div className="value-icon">
              <i className="fa-regular fa-clock"></i>
            </div>
            <h3>Timeless Design</h3>
            <p>
              Elegant and sophisticated jewellery designed for every occasion to transcend trends.
            </p>
          </div>

          <div className="value-card reveal-on-scroll" style={{ transitionDelay: '0.5s' }}>
            <div className="value-icon">
              <i className="fa-solid fa-medal"></i>
            </div>
            <h3>Trusted Quality</h3>
            <p>
              Uncompromising commitment to using the finest ethically sourced materials and gems.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
