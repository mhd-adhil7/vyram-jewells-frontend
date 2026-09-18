import { useState } from 'react';

const AdminSettingsPage = () => {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="admin-page-grid">
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-subtitle">Store Configuration</div>
            <h2>Boutique & Brand Settings</h2>
          </div>
        </div>

        {saved && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--admin-radius-sm)',
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fa-solid fa-circle-check"></i>
            <span>Settings successfully updated and published.</span>
          </div>
        )}

        <form className="admin-settings-form" onSubmit={handleSubmit}>
          <label>
            Boutique Brand Name
            <input type="text" defaultValue="Vyram Jewells" />
          </label>
          <label>
            Official Client Support Email
            <input type="email" defaultValue="concierge@vyramjewells.com" />
          </label>
          <label>
            VIP Concierge Phone / WhatsApp
            <input type="text" defaultValue="+91 (800) 555-VYRAM" />
          </label>
          <label>
            Order & Inquiry Notifications
            <select defaultValue="all">
              <option value="all">Instant Alerts for Orders & Custom Bridal Inquiries</option>
              <option value="orders">High-value Orders Only ($1,000+)</option>
              <option value="none">Mute Notifications</option>
            </select>
          </label>
          <label>
            Currency Symbol & Display
            <select defaultValue="usd">
              <option value="usd">USD ($) - International Tier</option>
              <option value="inr">INR (₹) - Domestic India</option>
              <option value="aed">AED (د.إ) - Middle East</option>
            </select>
          </label>

          <button type="submit">Save Changes</button>
        </form>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
