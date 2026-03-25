import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-chart-line', end: true },
  { to: '/admin/products', label: 'Products', icon: 'fa-box-open' },
  { to: '/admin/orders', label: 'Orders', icon: 'fa-bag-shopping' },
  { to: '/admin/customers', label: 'Customers', icon: 'fa-users' },
  { to: '/admin/messages', label: 'Messages', icon: 'fa-envelope' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-pie' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-gear' }
];

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/messages': 'Messages',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings'
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="admin-store-link">
          <i className="fa-solid fa-store"></i>
          <span>Back To Store</span>
        </Link>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>{currentTitle}</h1>
            <p>Manage your Vyram business in one place</p>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Search products, orders, customers..." />
            </div>
            <button className="admin-avatar-btn" type="button" aria-label="Admin account">
              <img
                src="https://ui-avatars.com/api/?name=Admin+User&background=2f3e34&color=fff"
                alt="Admin User"
              />
            </button>
            <button className="admin-logout-btn" type="button" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default AdminLayout;
