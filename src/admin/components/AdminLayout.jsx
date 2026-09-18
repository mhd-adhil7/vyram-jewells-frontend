import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-chart-line', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-gem' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-bag-shopping', badge: '4' },
  { to: '/admin/customers', label: 'Customers', icon: 'fa-users' },
  { to: '/admin/messages', label: 'Messages', icon: 'fa-envelope', badge: '28' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-pie' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-sliders' }
];

const pageTitles = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of business performance and store activity' },
  '/admin/products': { title: 'Product Catalog', subtitle: 'Manage jewelry items, pricing, inventory and collections' },
  '/admin/orders': { title: 'Customer Orders', subtitle: 'Track and process fine jewelry orders and deliveries' },
  '/admin/customers': { title: 'Client Directory', subtitle: 'Manage VIP clientele and purchase histories' },
  '/admin/messages': { title: 'Inquiries & Messages', subtitle: 'Customer appointments, bridal consultations and requests' },
  '/admin/analytics': { title: 'Sales Analytics', subtitle: 'Revenue trends, top categories, and channel performance' },
  '/admin/settings': { title: 'Store Settings', subtitle: 'Store configuration, contact information and preferences' }
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = pageTitles[location.pathname] || {
    title: 'Admin Portal',
    subtitle: 'Manage your Vyram business in one place'
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      {/* Mobile Top Navbar */}
      <header className="admin-mobile-header">
        <button
          type="button"
          className="admin-hamburger-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
        </button>

        <Link to="/admin" className="admin-mobile-logo">
          <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
        </Link>

        <div className="admin-mobile-actions">
          <Link to="/" target="_blank" rel="noreferrer" className="admin-icon-btn" title="View Store">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </Link>
          <div className="admin-avatar-mini">
            <span>AU</span>
          </div>
        </div>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <Link to="/admin" className="admin-brand-link">
            <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
            <span className="admin-brand-tag">Luxury Admin Suite</span>
          </Link>
        </div>

        <div className="admin-nav-section-label">Navigation</div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              <span className="admin-nav-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </span>
              <span className="admin-nav-label">{item.label}</span>
              {item.badge ? <span className="admin-nav-badge">{item.badge}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" rel="noreferrer" className="admin-store-link">
            <div className="admin-store-icon">
              <i className="fa-solid fa-gem"></i>
            </div>
            <div className="admin-store-text">
              <strong>View Storefront</strong>
              <span>Open live website</span>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square admin-store-arrow"></i>
          </Link>

          <div className="admin-user-card">
            <div className="admin-user-avatar">
              <span>AU</span>
              <span className="admin-user-status"></span>
            </div>
            <div className="admin-user-info">
              <strong>Admin User</strong>
              <span>Super Admin</span>
            </div>
            <button
              type="button"
              className="admin-logout-icon-btn"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="admin-main">
        {/* Desktop Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-breadcrumbs">
              <span>Vyram</span>
              <i className="fa-solid fa-chevron-right"></i>
              <span className="admin-breadcrumb-active">{currentPage.title}</span>
            </div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.subtitle}</p>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search products, orders, clients..."
                aria-label="Search"
              />
              <span className="admin-search-kbd">⌘K</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="admin-topbar-btn admin-view-store-btn"
              title="Open storefront in new tab"
            >
              <i className="fa-solid fa-store"></i>
              <span>Live Store</span>
            </Link>

            <button
              type="button"
              className="admin-icon-btn admin-notification-btn"
              aria-label="Notifications"
            >
              <i className="fa-regular fa-bell"></i>
              <span className="admin-badge-dot"></span>
            </button>

            <div className="admin-topbar-divider"></div>

            <div className="admin-user-dropdown">
              <div className="admin-avatar-btn">
                <span>AU</span>
              </div>
              <div className="admin-user-meta">
                <span className="admin-user-name">Admin User</span>
                <span className="admin-user-role">Super Admin</span>
              </div>
              <button
                type="button"
                className="admin-logout-btn"
                onClick={handleLogout}
                title="Sign out of admin"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
