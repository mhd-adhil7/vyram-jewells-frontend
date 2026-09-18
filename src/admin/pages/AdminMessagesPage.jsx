import { useState } from 'react';

const initialMessages = [
  {
    id: 1,
    from: 'Priya Sundaram',
    email: 'priya.s@gmail.com',
    subject: 'Custom Bridal Diamond Choker Consultation',
    preview: 'I am looking for a heritage polki and uncut emerald choker set for my wedding in December. Can we schedule an appointment?',
    time: '12m ago',
    tag: 'Bridal VIP',
    unread: true
  },
  {
    id: 2,
    from: 'Saanvi Kapoor',
    email: 'saanvi.k@gmail.com',
    subject: 'Ring Size Exchange for Order #ORD-8910',
    preview: 'The solitaire ring delivered yesterday is slightly loose. Could we request a resize or exchange for size 12?',
    time: '45m ago',
    tag: 'Exchange',
    unread: true
  },
  {
    id: 3,
    from: 'Rahul & Nisha',
    email: 'rahul.nisha@outlook.com',
    subject: 'Private Vault Viewing Appointment',
    preview: 'We would love to visit the flagship studio this Saturday afternoon to view the latest temple collection.',
    time: '2h ago',
    tag: 'Appointment',
    unread: false
  },
  {
    id: 4,
    from: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    subject: 'Matching earrings for Kasu Haram',
    preview: 'Hello! I purchased the Kasu Haram last month and was wondering if matching jhumkas can be crafted?',
    time: '5h ago',
    tag: 'Bespoke',
    unread: false
  }
];

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMsg, setSelectedMsg] = useState(messages[0]);

  const markAsRead = (id) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  };

  return (
    <div className="admin-page-grid">
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-subtitle">Client Concierge</div>
            <h2>Inquiries & Consultations</h2>
          </div>
          <span className="admin-nav-badge" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            {messages.filter((m) => m.unread).length} New Inquiries
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="admin-inquiries-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="admin-inquiry-item"
                style={{
                  padding: '14px',
                  borderRadius: 'var(--admin-radius-sm)',
                  background: selectedMsg.id === msg.id ? 'var(--admin-gold-soft)' : 'var(--admin-surface-subtle)',
                  cursor: 'pointer',
                  border: selectedMsg.id === msg.id ? '1px solid var(--admin-gold)' : '1px solid transparent',
                  transition: 'var(--admin-transition)'
                }}
                onClick={() => {
                  setSelectedMsg(msg);
                  markAsRead(msg.id);
                }}
              >
                <div className="admin-inquiry-avatar">{msg.from.slice(0, 2).toUpperCase()}</div>
                <div className="admin-inquiry-info">
                  <div className="admin-inquiry-head">
                    <strong style={{ fontWeight: msg.unread ? 700 : 600 }}>{msg.from}</strong>
                    <span className="admin-inquiry-tag">{msg.tag}</span>
                  </div>
                  <strong style={{ display: 'block', fontSize: '0.88rem', margin: '2px 0', color: 'var(--admin-primary-dark)' }}>
                    {msg.subject}
                  </strong>
                  <p>{msg.preview}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="admin-inquiry-time">{msg.time}</span>
                    {msg.unread && (
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--admin-gold)' }}></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMsg && (
            <div
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius-md)',
                padding: '20px',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--admin-font-serif)', fontSize: '1.25rem', color: 'var(--admin-primary-dark)' }}>
                    {selectedMsg.subject}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    From: <strong>{selectedMsg.from}</strong> ({selectedMsg.email})
                  </p>
                </div>
                <span className="admin-inquiry-tag">{selectedMsg.tag}</span>
              </div>

              <div
                style={{
                  padding: '16px',
                  background: 'var(--admin-surface-subtle)',
                  borderRadius: 'var(--admin-radius-sm)',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'var(--admin-text-main)',
                  flex: 1
                }}
              >
                {selectedMsg.preview}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                  className="admin-btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <i className="fa-solid fa-reply"></i>
                  <span>Reply to Client</span>
                </a>
                <button type="button" className="admin-btn-secondary">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Schedule Consultation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminMessagesPage;
