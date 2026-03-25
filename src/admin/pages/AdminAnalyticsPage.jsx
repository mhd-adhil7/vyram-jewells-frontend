const channels = [
  { label: 'Instagram', value: 64 },
  { label: 'WhatsApp', value: 52 },
  { label: 'Website', value: 71 },
  { label: 'Walk In', value: 38 }
];

const AdminAnalyticsPage = () => {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Analytics</h2>
      </div>

      <div className="admin-analytics-grid">
        <article className="admin-analytics-card">
          <p>Conversion Rate</p>
          <h3>4.7%</h3>
          <span>+0.6% this month</span>
        </article>
        <article className="admin-analytics-card">
          <p>Average Order Value</p>
          <h3>$1,248</h3>
          <span>+3.2% this month</span>
        </article>
        <article className="admin-analytics-card">
          <p>Returning Customers</p>
          <h3>38%</h3>
          <span>+1.4% this month</span>
        </article>
      </div>

      <div className="admin-progress-list">
        {channels.map((channel) => (
          <div key={channel.label} className="admin-progress-item">
            <div>
              <h4>{channel.label}</h4>
              <span>{channel.value}%</span>
            </div>
            <div className="admin-progress-track">
              <div className="admin-progress-fill" style={{ width: `${channel.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminAnalyticsPage;
