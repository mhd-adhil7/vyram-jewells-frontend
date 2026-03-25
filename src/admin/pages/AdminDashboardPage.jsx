const stats = [
  { label: 'Total Revenue', value: '$45,231', trend: '+12.5%', icon: 'fa-dollar-sign' },
  { label: 'Orders', value: '1,245', trend: '+8.2%', icon: 'fa-bag-shopping' },
  { label: 'Products', value: '342', trend: '+2.1%', icon: 'fa-box-open' },
  { label: 'New Messages', value: '28', trend: '+15.0%', icon: 'fa-envelope' }
];

const sales = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 38 },
  { month: 'Mar', value: 58 },
  { month: 'Apr', value: 52 },
  { month: 'May', value: 68 },
  { month: 'Jun', value: 82 }
];

const AdminDashboardPage = () => {
  return (
    <div className="admin-page-grid">
      <section className="admin-stats-grid">
        {stats.map((item) => (
          <article key={item.label} className="admin-card admin-stat-card">
            <div className="admin-stat-head">
              <p>{item.label}</p>
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <h3>{item.value}</h3>
            <span>{item.trend} vs last month</span>
          </article>
        ))}
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Sales Overview</h2>
          <button type="button">This Year</button>
        </div>
        <div className="admin-bars">
          {sales.map((item) => (
            <div key={item.month} className="admin-bar-item">
              <div className="admin-bar-track">
                <div className="admin-bar-fill" style={{ height: `${item.value}%` }}></div>
              </div>
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Recent Orders</h2>
        </div>
        <ul className="admin-list">
          <li>
            <div>
              <h4>Order #001</h4>
              <p>2 minutes ago</p>
            </div>
            <strong>$1,299</strong>
          </li>
          <li>
            <div>
              <h4>Order #002</h4>
              <p>14 minutes ago</p>
            </div>
            <strong>$879</strong>
          </li>
          <li>
            <div>
              <h4>Order #003</h4>
              <p>33 minutes ago</p>
            </div>
            <strong>$2,450</strong>
          </li>
          <li>
            <div>
              <h4>Order #004</h4>
              <p>1 hour ago</p>
            </div>
            <strong>$699</strong>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
