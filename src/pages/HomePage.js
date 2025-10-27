import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BlogModal from '../components/BlogModal';
import BackgroundAnimations from '../components/BackgroundAnimations';
import { blogContent } from '../data/blogContent';
import './HomePage.css';

const AUTOPLAY_MS = 3500; // auto-slide speed

const HomePage = ({ onNavigateToExplore, onArtistClick }) => {
  const { state, actions } = useAppContext();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Organize all kreatives by categories (no filtering by preferences)
    if (state.kreatives.length > 0) {
      const categoryGroups = {
        'Fine Artists': state.kreatives.filter(k => k.category === 'fine artist'),
        'Digital Artists': state.kreatives.filter(k => k.category === 'digital artist'),
        'Photographers': state.kreatives.filter(k => k.category === 'photographer'),
        'Animators': state.kreatives.filter(k => k.category === 'animator'),
        'Designers': state.kreatives.filter(k => k.category === 'designer'),
        'Musicians': state.kreatives.filter(k => k.category === 'musician')
      };
      setCategories(Object.entries(categoryGroups).filter(([_, kreatives]) => kreatives.length > 0));
    }
  }, [state.kreatives]);

  // Recommended kreatives (kept as-is)
  const getRecommendedKreatives = () => {
    if (!state.userPreferences || state.userPreferences.length === 0) return [];
    const categoryMapping = {
      'digital-art': ['digital artist'],
      'visual-art': ['fine artist'],
      'music-sound': ['musician'],
      'photography': ['photographer'],
      'animation': ['animator'],
      'graphic-design': ['designer'],
      'crafts-textiles': ['fine artist'],
      'sculpture': ['fine artist'],
      'writing': ['writer'],
      'performance': ['performer']
    };
    const preferred = state.userPreferences.flatMap(pref => categoryMapping[pref] || []);
    return state.kreatives.filter(k => preferred.includes(k.category.toLowerCase()));
  };

  const recommendedKreatives = getRecommendedKreatives();
  const displayKreatives = recommendedKreatives.length > 0 ? recommendedKreatives : state.kreatives;
  const n = displayKreatives.length;

  // --- AUTOPLAY (pauses on hover and when tab is hidden) ---
  useEffect(() => {
    if (n < 2) return;
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const id = setInterval(() => {
      if (!paused) setCurrentCarouselIndex(i => (i + 1) % n);
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [paused, n]);

  // Jump helper (pause briefly so glide completes cleanly)
  const jumpTo = (idx) => {
    if (!n) return;
    setPaused(true);
    const safe = ((idx % n) + n) % n;
    setCurrentCarouselIndex(safe);
    setTimeout(() => setPaused(false), 700);
  };

  const handleFavorite = (kreative) => {
    const isFavorited = state.favorites.some(fav => fav.id === kreative.id);
    if (isFavorited) actions.removeFavorite(kreative.id);
    else actions.addFavorite(kreative);
  };

  const cryptoPartners = [
    { name: 'Ethereum', symbol: 'ETH', logo: '⟠' },
    { name: 'Solana', symbol: 'SOL', logo: '◎' },
    { name: 'Bitcoin', symbol: 'BTC', logo: '₿' },
    { name: 'Polygon', symbol: 'MATIC', logo: '⬟' },
    { name: 'Cardano', symbol: 'ADA', logo: '₳' },
    { name: 'Binance', symbol: 'BNB', logo: '⬡' },
    { name: 'Avalanche', symbol: 'AVAX', logo: '▲' },
    { name: 'Tezos', symbol: 'XTZ', logo: 'ꜩ' },
    { name: 'Polkadot', symbol: 'DOT', logo: '●' }
  ];

  // Distance from active index, wrapped into the range (-n/2 .. +n/2]
  const wrappedDistance = (i) => {
    if (!n) return 0;
    let d = i - currentCarouselIndex;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d; // e.g., -3..+3
  };

  return (
    <div className="home-container">
      <BackgroundAnimations intensity="light" theme="purple" />

      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src={`${process.env.PUBLIC_URL}/images/logos-img/AfriKreateLogo.png`}
              alt="AfriKreate Logo"
              className="header-logo"
              onError={(e) => {
                console.log('Logo failed to load from:', e.target.src);
                e.target.src = "/images/logos-img/AfriKreateLogo.png";
              }}
            />
          </div>

          <nav className="main-nav">
            <button className="nav-btn" onClick={onNavigateToExplore}>Explore</button>
            <button className="nav-btn">Favourites</button>
            <button className="nav-btn">Profile</button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Featured Kreatives */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Discover South Africa&apos;s Creative Talent</h2>
          <p className="hero-subtitle">Connect with artists, support creativity, and invest in the future of African art</p>

          <div className="featured-profiles">
            <h3 className="section-title">
              {recommendedKreatives.length > 0 ? 'Recommended For You' : 'Featured AfriKreatives'}
            </h3>

            {n > 0 ? (
              <>
                <div
                  className="carousel-wrapper"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <div className="carousel-items" role="region" aria-roledescription="carousel" aria-label="Featured AfriKreatives">
                    {displayKreatives.map((k, i) => {
                      const dist = wrappedDistance(i);           // -3..+3 etc.
                      const pos = Math.max(-2, Math.min(2, dist)); // clamp to show only 5 cards
                      const isHidden = Math.abs(dist) > 2;
                      const isActive = dist === 0;
                      const isOuter = Math.abs(pos) === 2;

                      return (
                        <div
                          key={k.id ?? i}
                          className={`carousel-profile-card ${isActive ? 'active' : ''} ${isOuter ? 'outer' : 'side'} ${isHidden ? 'is-hidden' : ''}`}
                          style={{ '--pos': pos }}
                          onClick={() => isActive && onArtistClick && onArtistClick(k)}
                          aria-current={isActive ? 'true' : 'false'}
                        >
                          <div className="carousel-image-wrapper">
                            <img src={k.image} alt={k.name} className="carousel-profile-image" />
                          </div>
                          <h4 className="carousel-profile-name">{k.name}</h4>
                          <p className="carousel-profile-description">
                            {k.description.length > 120 ? k.description.substring(0, 120) + '…' : k.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dots – one per artist (matches exactly) */}
                  <div className="carousel-dots">
                    {displayKreatives.map((_, i) => (
                      <button
                        key={i}
                        className={`carousel-dot ${i === currentCarouselIndex ? 'active' : ''}`}
                        onClick={() => jumpTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <button className="explore-btn" onClick={onNavigateToExplore}>Explore All Kreatives</button>
              </>
            ) : (
              <div className="no-results">
                <p>No artists available</p>
                <button className="explore-btn" onClick={onNavigateToExplore}>Explore All Kreatives</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All AfriKreatives Section */}
      <section className="categories-section">
        <div className="category-row">
          <div className="category-header">
            <h3 className="category-title">All AfriKreatives</h3>
            <p className="category-description">
              Browse through our diverse community of South African kreatives and connect with artists that inspire you.
            </p>
            <button className="view-all-btn" onClick={onNavigateToExplore}>Explore All</button>
          </div>

          <div className="kreatives-scroll">
            {state.kreatives.map((kreative) => (
              <div key={kreative.id} className="kreative-card" onClick={() => onArtistClick && onArtistClick(kreative)}>
                <div className="kreative-image">
                  <img src={kreative.image} alt={kreative.name} />
                  <div className="kreative-overlay">
                    <button
                      className="view-profile-btn"
                      onClick={(e) => { e.stopPropagation(); onArtistClick && onArtistClick(kreative); }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="kreative-info">
                  <h4 className="kreative-name">{kreative.name}</h4>
                  <p className="kreative-description">{kreative.description.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crypto Partners Section */}
      <section className="crypto-section">
        <div className="crypto-content">
          <h3 className="section-title">Supported Crypto Wallets</h3>
          <p className="section-subtitle">Invest in creativity with secure blockchain technology</p>

          <div className="crypto-partners">
            {cryptoPartners.map((partner) => (
              <div key={partner.symbol} className="crypto-card">
                <div className="crypto-logo">{partner.logo}</div>
                <h4 className="crypto-name">{partner.name}</h4>
                <p className="crypto-symbol">{partner.symbol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Resources Section */}
      <section className="education-section">
        <div className="education-content">
          <h3 className="section-title">Learn About Blockchain &amp; Art</h3>
          <p className="section-subtitle">Educational resources to help you understand the future of creative investment</p>

          <div className="education-grid">
            <article className="education-card">
              <div className="education-image"><div className="placeholder-image">📚</div></div>
              <div className="education-content-text">
                <h4>What is Blockchain Art?</h4>
                <p>Learn how blockchain technology is revolutionizing the art world and creating new opportunities for artists and collectors.</p>
                <button className="read-more-btn" onClick={() => setSelectedBlog(blogContent['blockchain-art'])}>Read More</button>
              </div>
            </article>

            <article className="education-card">
              <div className="education-image"><div className="placeholder-image">💎</div></div>
              <div className="education-content-text">
                <h4>Investing in Creative Assets</h4>
                <p>Discover how to support artists while building a valuable portfolio of creative works and intellectual property.</p>
                <button className="read-more-btn" onClick={() => setSelectedBlog(blogContent['investing-creative'])}>Read More</button>
              </div>
            </article>

            <article className="education-card">
              <div className="education-image"><div className="placeholder-image">🌍</div></div>
              <div className="education-content-text">
                <h4>Supporting African Creativity</h4>
                <p>Learn about the impact of supporting local artists and how AfriKreate is building a sustainable creative economy.</p>
                <button className="read-more-btn" onClick={() => setSelectedBlog(blogContent['supporting-african'])}>Read More</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <img
              src={`${process.env.PUBLIC_URL}/images/logos-img/AfriKreateLogo.png`}
              alt="AfriKreate Logo"
              className="footer-logo"
              onError={(e) => { console.log('Logo failed to load from:', e.target.src); e.target.src = "/images/logos-img/AfriKreateLogo.png"; }}
            />
            <p>Empowering South African creativity through blockchain technology</p>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">TikTok</a>
              <a href="#" className="social-link">Twitter/X</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025, AfriKreate – Powered by Ligoody2Shoes</p>
        </div>
      </footer>

      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
    </div>
  );
};

export default HomePage;
