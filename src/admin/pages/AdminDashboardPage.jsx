import { useState } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$45,231',
    trend: '+12.5%',
    trendUp: true,
    subtext: '+$5,024 vs last month',
    icon: 'fa-gem',
    color: 'gold'
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '1,245',
    trend: '+8.2%',
    trendUp: true,
    subtext: '18 awaiting dispatch',
    icon: 'fa-bag-shopping',
    color: 'emerald'
  },
  {
    id: 'catalog',
    label: 'Active Catalog',
    value: '342',
    trend: '+2.1%',
    trendUp: true,
    subtext: 'Across 12 collections',
    icon: 'fa-box-open',
    color: 'sapphire'
  },
  {
    id: 'messages',
    label: 'Client Inquiries',
    value: '28',
    trend: '+15.0%',
    trendUp: true,
    subtext: '6 bridal appointments',
    icon: 'fa-envelope-open-text',
    color: 'rose'
  }
];

const salesData = [
  { month: 'Jan', value: 45, amount: '$45,000', orders: 120 },
  { month: 'Feb', value: 38, amount: '$38,000', orders: 98 },
  { month: 'Mar', value: 58, amount: '$58,000', orders: 154 },
  { month: 'Apr', value: 52, amount: '$52,000', orders: 139 },
  { month: 'May', value: 68, amount: '$68,000', orders: 182 },
  { month: 'Jun', value: 82, amount: '$82,000', orders: 215 }
];

const categorySales = [
  { name: 'Bridal Sets', percentage: 38, revenue: '$17,187', count: 48, color: '#C5A059' },
  { name: 'Necklaces & Haram', percentage: 27, revenue: '$12,212', count: 86, color: '#2F5233' },
  { name: 'Bangles & Kadas', percentage: 21, revenue: '$9,498', count: 112, color: '#748B6F' },
  { name: 'Earrings & Jhumkas', percentage: 14, revenue: '$6,334', count: 96, color: '#9E8B75' }
];

const recentOrders = [
  {
    id: 'ORD-8942',
    customer: 'Ananya Deshmukh',
    initials: 'AD',
    item: 'Heritage Polki Bridal Choker Set',
    time: '2 mins ago',
    amount: '$2,450',
    status: 'Processing',
    statusClass: 'processing'
  },
  {
    id: 'ORD-8941',
    customer: 'Vikram & Rhea Singhania',
    initials: 'VR',
    item: 'Temple Ruby & Emerald Kasu Haram',
    time: '18 mins ago',
    amount: '$3,890',
    status: 'Delivered',
    statusClass: 'delivered'
  },
  {
    id: 'ORD-8940',
    customer: 'Meera Nambiar',
    initials: 'MN',
    item: '22K Gold Filigree Antique Bangles',
    time: '45 mins ago',
    amount: '$1,299',
    status: 'Pending',
    statusClass: 'pending'
  },
  {
    id: 'ORD-8939',
    customer: 'Kavita Chawla',
    initials: 'KC',
    item: 'Solitaire Diamond Floral Ring',
    time: '1 hour ago',
    amount: '$879',
    status: 'Shipped',
    statusClass: 'shipped'
  },
  {
    id: 'ORD-8938',
    customer: 'Pooja Hegde',
    initials: 'PH',
    item: 'South Sea Pearl Layered Haar',
    time: '3 hours ago',
    amount: '$1,650',
    status: 'Delivered',
    statusClass: 'delivered'
  }
];

const clientInquiries = [
  {
    name: 'Priya Sundaram',
    initials: 'PS',
    subject: 'Custom Bridal Diamond Set consultation',
    time: '5m ago',
    tag: 'Bridal VIP'
  },
  {
    name: 'Saanvi Kapoor',
    initials: 'SK',
    subject: 'Ring sizing adjustment for ORD-8910',
    time: '32m ago',
    tag: 'Support'
  },
  {
    name: 'Rohit Verma',
    initials: 'RV',
    subject: 'Store appointment for bespoke groom jewellery',
    time: '1h ago',
    tag: 'Appointment'
  }
];

const lowStockAlerts = [
  { name: 'Kundan Navratna Bridal Choker', remaining: 2, threshold: 5 },
  { name: 'Jadau Uncut Diamond Mathapatti', remaining: 1, threshold: 4 },
  { name: 'Temple Nakshi Peacock Kada', remaining: 3, threshold: 6 }
];

const AdminDashboardPage = () => {
  const [activeRange, setActiveRange] = useState('6M');
  const [hoveredMonth, setHoveredMonth] = useState(salesData[salesData.length - 1]);

  return (
    <div className="admin-page-grid">
      {/* Welcome Hero Banner */}
      <section className="admin-hero-banner">
        <div className="admin-hero-content">
          <div className="admin-hero-badge">
            <span className="admin-pulse-dot"></span>
            <span>Store Online & Syncing</span>
          </div>
          <h2>Welcome back, Master Jeweller</h2>
          <p>
            Here is your daily pulse. Your revenue is up <strong>12.5%</strong> this month with 18 high-value bridal orders in queue.
          </p>
        </div>

        <div className="admin-hero-actions">
          <Link to="/admin/products" className="admin-btn-luxury-primary">
            <i className="fa-solid fa-plus"></i>
            <span>Add New Jewel</span>
          </Link>
          <Link to="/admin/orders" className="admin-btn-luxury-ghost">
            <i className="fa-solid fa-bag-shopping"></i>
            <span>View Orders</span>
          </Link>
          <Link to="/admin/analytics" className="admin-btn-luxury-ghost">
            <i className="fa-solid fa-chart-line"></i>
            <span>Analytics</span>
          </Link>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="admin-stats-grid">
        {stats.map((item) => (
          <article key={item.id} className={`admin-card admin-stat-card theme-${item.color}`}>
            <div className="admin-stat-head">
              <span className="admin-stat-label">{item.label}</span>
              <div className={`admin-stat-icon-wrap icon-${item.color}`}>
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
            </div>

            <div className="admin-stat-body">
              <h3 className="admin-stat-value">{item.value}</h3>
              <div className="admin-stat-trend-row">
                <span className={`admin-trend-badge ${item.trendUp ? 'positive' : 'negative'}`}>
                  <i className={`fa-solid ${item.trendUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                  {item.trend}
                </span>
                <span className="admin-stat-subtext">{item.subtext}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Analytics & Performance Row */}
      <section className="admin-dashboard-row">
        {/* Sales Overview Chart */}
        <div className="admin-card admin-chart-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-subtitle">Revenue Analytics</div>
              <h2>Sales Performance</h2>
            </div>

            <div className="admin-chart-filter-pills">
              {['30D', '6M', '1Y', 'All'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setActiveRange(range)}
                  className={`admin-filter-pill ${activeRange === range ? 'active' : ''}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-chart-summary">
            <div className="admin-chart-metric">
              <span>Selected Period Volume</span>
              <strong>{hoveredMonth ? hoveredMonth.amount : '$343,000'}</strong>
            </div>
            <div className="admin-chart-metric">
              <span>Orders in {hoveredMonth ? hoveredMonth.month : 'Month'}</span>
              <strong>{hoveredMonth ? `${hoveredMonth.orders} orders` : '908 orders'}</strong>
            </div>
            <div className="admin-chart-highlight-tag">
              <i className="fa-solid fa-crown"></i>
              <span>Peak Month: June ($82k)</span>
            </div>
          </div>

          <div className="admin-bars-wrapper">
            <div className="admin-bars">
              {salesData.map((item) => (
                <div
                  key={item.month}
                  className={`admin-bar-item ${hoveredMonth?.month === item.month ? 'selected' : ''}`}
                  onMouseEnter={() => setHoveredMonth(item)}
                >
                  <div className="admin-bar-tooltip">
                    <span>{item.amount}</span>
                  </div>
                  <div className="admin-bar-track">
                    <div className="admin-bar-fill" style={{ height: `${item.value}%` }}></div>
                  </div>
                  <span className="admin-bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="admin-card admin-category-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-subtitle">Collection Share</div>
              <h2>Top Categories</h2>
            </div>
            <Link to="/admin/products" className="admin-link-more" title="View catalog">
              <span>Catalog</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="admin-category-list">
            {categorySales.map((cat) => (
              <div key={cat.name} className="admin-category-item">
                <div className="admin-cat-info">
                  <div className="admin-cat-name-wrap">
                    <span className="admin-cat-dot" style={{ background: cat.color }}></span>
                    <strong>{cat.name}</strong>
                  </div>
                  <div className="admin-cat-numbers">
                    <span className="admin-cat-rev">{cat.revenue}</span>
                    <span className="admin-cat-pct">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="admin-cat-track">
                  <div
                    className="admin-cat-fill"
                    style={{ width: `${cat.percentage}%`, background: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-card-footer-alert">
            <i className="fa-solid fa-sparkles"></i>
            <span>Bridal Sets generate the highest ticket average at $2,450/order.</span>
          </div>
        </div>
      </section>

      {/* Orders & Inquiries Row */}
      <section className="admin-dashboard-row">
        {/* Recent Orders List */}
        <div className="admin-card admin-orders-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-subtitle">Live Activity</div>
              <h2>Recent Orders</h2>
            </div>
            <Link to="/admin/orders" className="admin-link-more">
              <span>View All ({recentOrders.length})</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="admin-orders-table-wrap">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Jewellery Piece</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="admin-order-client">
                        <div className="admin-order-avatar">{order.initials}</div>
                        <div>
                          <strong>{order.customer}</strong>
                          <span>{order.id} • {order.time}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-order-item-desc">{order.item}</span>
                    </td>
                    <td>
                      <strong className="admin-order-price">{order.amount}</strong>
                    </td>
                    <td>
                      <span className={`admin-luxury-badge badge-${order.statusClass}`}>
                        <span className="badge-dot"></span>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Consultations & Low Stock Alerts */}
        <div className="admin-side-stack">
          {/* VIP Inquiries */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-subtitle">VIP Concierge</div>
                <h2>Client Inquiries</h2>
              </div>
              <Link to="/admin/messages" className="admin-link-more">
                <span>All ({clientInquiries.length})</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="admin-inquiries-list">
              {clientInquiries.map((inq) => (
                <div key={inq.name} className="admin-inquiry-item">
                  <div className="admin-inquiry-avatar">{inq.initials}</div>
                  <div className="admin-inquiry-info">
                    <div className="admin-inquiry-head">
                      <strong>{inq.name}</strong>
                      <span className="admin-inquiry-tag">{inq.tag}</span>
                    </div>
                    <p>{inq.subject}</p>
                    <span className="admin-inquiry-time">{inq.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Watchlist */}
          <div className="admin-card admin-alert-card">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-subtitle">Vault Inventory</div>
                <h2>Low Stock Watch</h2>
              </div>
              <span className="admin-warning-pill">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Action Needed
              </span>
            </div>

            <div className="admin-stock-list">
              {lowStockAlerts.map((item) => (
                <div key={item.name} className="admin-stock-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>Artisan replenishment advised</span>
                  </div>
                  <div className="admin-stock-badge">
                    <span>{item.remaining} left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
