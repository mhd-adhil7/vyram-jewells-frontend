const channels = [
  { label: 'Instagram Direct & Boutique Stories', value: 68, revenue: '$30,750' },
  { label: 'Official Website & E-Store', value: 74, revenue: '$33,470' },
  { label: 'WhatsApp VIP Concierge', value: 58, revenue: '$26,230' },
  { label: 'Private Studio & Walk-In Clients', value: 42, revenue: '$18,990' }
];

const AdminAnalyticsPage = () => {
  return (
    <div className="admin-page-grid">
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-subtitle">Performance Intelligence</div>
            <h2>Key Sales & Conversion Metrics</h2>
          </div>
          <button type="button" className="admin-btn-secondary" style={{ height: '36px' }}>
            <i className="fa-solid fa-download"></i>
            <span>Export Report (PDF)</span>
          </button>
        </div>

        <div className="admin-analytics-grid">
          <article className="admin-analytics-card">
            <p>Conversion Rate</p>
            <h3>4.8%</h3>
            <span>+0.6% vs last quarter</span>
          </article>
          <article className="admin-analytics-card">
            <p>Average Ticket Value</p>
            <h3>$1,480</h3>
            <span>+8.4% bridal set lift</span>
          </article>
          <article className="admin-analytics-card">
            <p>VIP Returning Rate</p>
            <h3>42.5%</h3>
            <span>+3.2% repeat jewelry buyers</span>
          </article>
        </div>

        <div style={{ marginTop: '28px' }}>
          <div className="admin-card-subtitle">Channel Breakdown</div>
          <h3 style={{ margin: '4px 0 16px', fontFamily: 'var(--admin-font-serif)', color: 'var(--admin-primary-dark)' }}>
            Sales by Acquisition Channel
          </h3>

          <div className="admin-progress-list">
            {channels.map((channel) => (
              <div key={channel.label} className="admin-progress-item">
                <div>
                  <h4 style={{ color: 'var(--admin-primary-dark)' }}>{channel.label}</h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ color: 'var(--admin-gold)', fontWeight: 700 }}>{channel.revenue}</span>
                    <span>{channel.value}%</span>
                  </div>
                </div>
                <div className="admin-progress-track">
                  <div className="admin-progress-fill" style={{ width: `${channel.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
