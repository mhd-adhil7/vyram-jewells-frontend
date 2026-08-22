import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { lookbookData } from '../data/lookbook';
import keralaImg from '../../assets/bridal/Kerala bridal.jpg';
import antiqueImg from '../../assets/bridal/Antique bride.jpg';
import trendingImg from '../../assets/bridal/Trending.jpg';

const parseCSV = (csvText) => {
  const lines = [];
  let currentLine = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentToken += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentToken += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentToken);
        currentToken = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentLine.push(currentToken);
        lines.push(currentLine);
        currentLine = [];
        currentToken = '';
      } else {
        currentToken += char;
      }
    }
  }

  if (currentToken || currentLine.length > 0) {
    currentLine.push(currentToken);
    lines.push(currentLine);
  }

  return lines;
};

const BridalCollectionPage = () => {
  const { collectionSlug } = useParams();
  const activeSlug = collectionSlug;
  const collection = lookbookData[activeSlug];

  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const isLightboxOpen = lightboxIndex !== null;

  // Filter collections display name matching Google Sheet column
  const collectionFilterName = useMemo(() => {
    if (activeSlug === 'malayali-manga') return 'Malayali Manga';
    if (activeSlug === 'premium-bridal-bloom') return 'Premium Bridal Bloom';
    if (activeSlug === 'bridal-vogue') return 'Bridal Vogue';
    return '';
  }, [activeSlug]);

  // Fetch from Google Sheet
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const response = await fetch(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vQGS3Vb_JRbgG_YZcewvzNi4InnNO-ngJxyQDbs89T_Evo_UVxUf9RaxQ0ahB8OrXxysF5TZoFV1RlT/pub?gid=1001&single=true&output=csv'
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch sheet data`);
        }
        const csvText = await response.text();
        const rows = parseCSV(csvText);

        const headerIdx = rows.findIndex((row) => {
          const cols = row.map((c) => c.trim().toLowerCase());
          return cols.includes('id') && cols.includes('collection');
        });

        if (headerIdx === -1) {
          if (isMounted) {
            setGalleryImages([]);
            setLoading(false);
          }
          return;
        }

        const headers = rows[headerIdx].map((h) => h.trim().toLowerCase());
        const idIdx = headers.indexOf('id');
        const collectionIdx = headers.indexOf('collection');

        let titleIdx = headers.indexOf('title');
        if (titleIdx === -1) titleIdx = headers.indexOf('name');

        let imageIdx = headers.indexOf('image_url');
        if (imageIdx === -1) imageIdx = headers.indexOf('optimized image url');
        if (imageIdx === -1) imageIdx = headers.indexOf('image');

        const items = [];
        for (let i = headerIdx + 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length <= 1) continue;

          const idVal = row[idIdx]?.trim();
          const collectionVal = row[collectionIdx]?.trim();
          const titleVal = titleIdx !== -1 ? row[titleIdx]?.trim() : '';
          const imageVal = imageIdx !== -1 ? row[imageIdx]?.trim() : '';

          if (
            collectionVal &&
            collectionFilterName &&
            collectionVal.toLowerCase() === collectionFilterName.toLowerCase() &&
            imageVal
          ) {
            items.push({
              id: idVal || `sheet-${i}`,
              collection: collectionVal,
              title: titleVal || 'Bridal Jewelry Detail',
              image: imageVal
            });
          }
        }

        if (isMounted) {
          setGalleryImages(items);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading bridal lookbook:', err);
        if (isMounted) {
          setGalleryImages([]);
          setLoading(false);
        }
      }
    }

    if (collectionFilterName) {
      loadData();
    }
    return () => {
      isMounted = false;
    };
  }, [collectionFilterName]);

  // Reveal animations
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        el.classList.add('visible');
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [loading, galleryImages]);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, nextImage, prevImage, closeLightbox]);

  const otherCollections = useMemo(() => {
    const list = [
      { slug: 'malayali-manga', title: 'Malayali Manga', heroImage: keralaImg },
      { slug: 'premium-bridal-bloom', title: 'Premium Bridal Bloom', heroImage: antiqueImg },
      { slug: 'bridal-vogue', title: 'Bridal Vogue', heroImage: trendingImg }
    ];
    return list.filter((col) => col.slug !== activeSlug);
  }, [activeSlug]);

  if (!collection) {
    return <Navigate to="/bridal" replace />;
  }

  const currentImage = galleryImages[lightboxIndex];

  // Collection specific descriptions
  const collectionDesc = (() => {
    if (activeSlug === 'malayali-manga') {
      return 'Celebrating the timeless beauty, tradition and elegance of Kerala brides.';
    }
    if (activeSlug === 'premium-bridal-bloom') {
      return 'A radiant expression of luxurious bridal jewellery and unforgettable beauty.';
    }
    if (activeSlug === 'bridal-vogue') {
      return 'A contemporary bridal story where fashion, confidence and elegance come together.';
    }
    return collection.description;
  })();

  return (
    <>
      <div className="lookbook-breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/bridal">Bridal</Link>
        <span>/</span>
        <span>{collection.title}</span>
      </div>

      <div className="lookbook-back-container">
        <Link to="/bridal" className="lookbook-back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Bridal Collections
        </Link>
      </div>

      <section className="lookbook-hero">
        <div className="lookbook-hero-content reveal-on-scroll">
          <h1 className="lookbook-hero-title">{collection.title.toUpperCase()}</h1>
          <div className="lookbook-hero-subtitle">“{collectionDesc}”</div>
          <div className="lookbook-hero-divider">
            <span></span>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="lookbook-loading">
          <div className="lookbook-spinner"></div>
          <p>Loading Editorial Lookbook...</p>
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="lookbook-empty-state reveal-on-scroll">
          <div className="lookbook-empty-line"></div>
          <h2>THE LOOKBOOK IS COMING SOON</h2>
          <p className="lookbook-empty-sub">New bridal looks are being curated for this collection.</p>
          <div className="lookbook-empty-line"></div>
        </div>
      ) : (
        <section className="lookbook-gallery-section">
          <div
            className={`lookbook-gallery-grid ${
              galleryImages.length === 1
                ? 'grid-single'
                : galleryImages.length <= 4
                ? 'grid-few'
                : 'grid-masonry'
            }`}
          >
            {galleryImages.map((item, index) => {
              // Alternate frames: arch-top, rounded, rect
              const shape =
                galleryImages.length === 1
                  ? 'rect'
                  : index % 3 === 0
                  ? 'arch-top'
                  : index % 3 === 1
                  ? 'rounded'
                  : 'rect';

              return (
                <div
                  key={item.id}
                  className="lookbook-gallery-item reveal-on-scroll"
                  style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                  onClick={() => openLightbox(index)}
                >
                  <div className={`lookbook-gallery-img-wrapper shape-${shape}`}>
                    <div className="lookbook-gallery-img">
                      <img src={item.image} alt={item.title} />
                      <div className="lookbook-gallery-overlay">
                        <span className="lookbook-gallery-overlay-btn">View Look</span>
                        <span className="lookbook-gallery-overlay-caption">{item.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="lookbook-explore-section reveal-on-scroll">
        <h2 className="lookbook-explore-title">Explore Another Lookbook</h2>
        <div className="lookbook-explore-grid">
          {otherCollections.map((col) => (
            <Link key={col.slug} to={`/bridal/${col.slug}`} className="lookbook-explore-card">
              <div className="lookbook-explore-img-wrapper">
                <img src={col.heroImage} alt={col.title} />
                <div className="lookbook-explore-card-title">{col.title.toUpperCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {isLightboxOpen && currentImage && (
        <div className="lookbook-lightbox">
          <button
            className="lookbook-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close Lightbox"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="lookbook-lightbox-counter">
            {String(lightboxIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
          </div>

          {galleryImages.length > 1 && (
            <button
              className="lookbook-lightbox-arrow prev"
              onClick={prevImage}
              aria-label="Previous Look"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div className="lookbook-lightbox-content">
            <div className="lookbook-lightbox-img-wrapper">
              <img
                className="lookbook-lightbox-img"
                src={currentImage.image}
                alt={currentImage.title}
              />
            </div>
            <div className="lookbook-lightbox-caption">{currentImage.title}</div>
          </div>

          {galleryImages.length > 1 && (
            <button
              className="lookbook-lightbox-arrow next"
              onClick={nextImage}
              aria-label="Next Look"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default BridalCollectionPage;
