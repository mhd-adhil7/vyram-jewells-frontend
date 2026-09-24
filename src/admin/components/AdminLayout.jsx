import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout-shell">
      {/* Luxury Minimal Admin Header */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-header-brand">
            <Link to="/admin" className="admin-brand-link" title="Vyram Jewells Admin">
              <img src="/assets/vyram-logo.png" alt="Vyram Jewells" className="admin-brand-logo" />
              <div className="admin-brand-text">
                <span className="admin-brand-title">Vyram Jewells</span>
                <span className="admin-brand-badge">Admin Panel</span>
              </div>
            </Link>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="admin-header-btn admin-view-store-btn"
              title="Open storefront in new tab"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <span>Live Store</span>
            </Link>

            <button
              type="button"
              className="admin-header-btn admin-logout-btn"
              onClick={handleLogout}
              title="Sign out of Admin Panel"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <div className="admin-main-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
