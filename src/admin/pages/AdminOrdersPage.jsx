import { useState } from 'react';

const initialOrders = [
  {
    id: 'ORD-8942',
    customer: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    items: 'Heritage Polki Bridal Choker Set (1)',
    date: 'Sep 18, 2026 • 10:14 AM',
    total: '$2,450',
    status: 'Processing',
    statusClass: 'processing'
  },
  {
    id: 'ORD-8941',
    customer: 'Vikram & Rhea Singhania',
    email: 'singhania.v@outlook.com',
    items: 'Temple Ruby & Emerald Kasu Haram (1)',
    date: 'Sep 18, 2026 • 09:42 AM',
    total: '$3,890',
    status: 'Delivered',
    statusClass: 'delivered'
  },
  {
    id: 'ORD-8940',
    customer: 'Meera Nambiar',
    email: 'meera.n@yahoo.com',
    items: '22K Gold Filigree Antique Bangles (Pair)',
    date: 'Sep 18, 2026 • 08:55 AM',
    total: '$1,299',
    status: 'Pending',
    statusClass: 'pending'
  },
  {
    id: 'ORD-8939',
    customer: 'Kavita Chawla',
    email: 'kavita.c@gmail.com',
    items: 'Solitaire Diamond Floral Ring (1)',
    date: 'Sep 17, 2026 • 05:20 PM',
    total: '$879',
    status: 'Shipped',
    statusClass: 'shipped'
  },
  {
    id: 'ORD-8938',
    customer: 'Pooja Hegde',
    email: 'pooja.h@gmail.com',
    items: 'South Sea Pearl Layered Haar (1)',
    date: 'Sep 17, 2026 • 02:11 PM',
    total: '$1,650',
    status: 'Delivered',
    statusClass: 'delivered'
  },
  {
    id: 'ORD-8937',
    customer: 'Rohit & Tanya Mehra',
    email: 'tanya.mehra@gmail.com',
    items: 'Jadau Uncut Diamond Mathapatti (1)',
    date: 'Sep 16, 2026 • 07:30 PM',
    total: '$3,120',
    status: 'Delivered',
    statusClass: 'delivered'
  }
];

const AdminOrdersPage = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredOrders = initialOrders.filter((order) => {
    const matchesFilter = filter === 'All' || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.items.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-page-grid">
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-subtitle">Order Management</div>
            <h2>Client Orders & Shipments</h2>
          </div>

          <div className="admin-chart-filter-pills">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
              <button
                key={status}
                type="button"
                className={`admin-filter-pill ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-search" style={{ marginBottom: '18px', width: '100%', maxWidth: '400px' }}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by order ID, client or jewelry piece..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Jewellery Item(s)</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong style={{ color: 'var(--admin-primary-dark)', fontFamily: 'monospace' }}>
                        {order.id}
                      </strong>
                    </td>
                    <td>
                      <div className="admin-order-client">
                        <div className="admin-order-avatar">
                          {order.customer.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong>{order.customer}</strong>
                          <span>{order.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-order-item-desc">{order.items}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                        {order.date}
                      </span>
                    </td>
                    <td>
                      <strong className="admin-order-price">{order.total}</strong>
                    </td>
                    <td>
                      <span className={`admin-luxury-badge badge-${order.statusClass}`}>
                        <span className="badge-dot"></span>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-empty-row">
                    No orders match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOrdersPage;
