import { useState } from 'react';

const initialCustomers = [
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    phone: '+91 98201 44521',
    city: 'Mumbai',
    orders: 14,
    spend: '$28,450',
    tier: 'VIP Patron'
  },
  {
    name: 'Vikram Singhania',
    email: 'singhania.v@outlook.com',
    phone: '+91 99110 88231',
    city: 'Delhi NCR',
    orders: 9,
    spend: '$19,200',
    tier: 'Bridal Elite'
  },
  {
    name: 'Meera Nambiar',
    email: 'meera.n@yahoo.com',
    phone: '+91 94470 12399',
    city: 'Bangalore',
    orders: 7,
    spend: '$11,850',
    tier: 'Gold Member'
  },
  {
    name: 'Kavita Chawla',
    email: 'kavita.c@gmail.com',
    phone: '+91 98105 77620',
    city: 'Chandigarh',
    orders: 5,
    spend: '$6,420',
    tier: 'Member'
  },
  {
    name: 'Pooja Hegde',
    email: 'pooja.h@gmail.com',
    phone: '+91 98450 33214',
    city: 'Hyderabad',
    orders: 4,
    spend: '$5,900',
    tier: 'Member'
  },
  {
    name: 'Rohit Mehra',
    email: 'tanya.mehra@gmail.com',
    phone: '+91 98210 66541',
    city: 'Jaipur',
    orders: 3,
    spend: '$4,150',
    tier: 'Member'
  }
];

const AdminCustomersPage = () => {
  const [search, setSearch] = useState('');

  const filtered = initialCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-grid">
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-subtitle">Clientele Directory</div>
            <h2>VIP Clients & Patrons</h2>
          </div>

          <div className="admin-search" style={{ width: '300px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search clients by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-customers-grid">
          {filtered.map((customer) => (
            <article key={customer.email} className="admin-customer-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{customer.name}</h4>
                  <p>{customer.email} • {customer.phone}</p>
                </div>
                <span>{customer.tier}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--admin-border-subtle)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <span style={{ background: 'transparent', padding: 0, color: 'var(--admin-text-muted)' }}>
                    Location:
                  </span>{' '}
                  <strong>{customer.city}</strong>
                </div>
                <div>
                  <span style={{ background: 'transparent', padding: 0, color: 'var(--admin-text-muted)' }}>
                    Orders:
                  </span>{' '}
                  <strong>{customer.orders}</strong>
                </div>
                <div>
                  <span style={{ background: 'transparent', padding: 0, color: 'var(--admin-text-muted)' }}>
                    Total Spend:
                  </span>{' '}
                  <strong style={{ color: 'var(--admin-primary-dark)' }}>{customer.spend}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminCustomersPage;
