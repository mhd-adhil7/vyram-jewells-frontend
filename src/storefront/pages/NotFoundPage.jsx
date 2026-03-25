import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="search-results-section">
      <div className="search-results-header">
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link to="/" className="btn btn-primary page-transition-link">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
