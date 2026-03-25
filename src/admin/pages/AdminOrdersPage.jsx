const orders = [
  { id: 'ORD-201', customer: 'Aarav Nair', total: '$1,299', status: 'Pending' },
  { id: 'ORD-202', customer: 'Maya Iyer', total: '$2,750', status: 'Processing' },
  { id: 'ORD-203', customer: 'Neha Gupta', total: '$899', status: 'Shipped' },
  { id: 'ORD-204', customer: 'Ravi Kumar', total: '$1,100', status: 'Delivered' }
];

const AdminOrdersPage = () => {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Orders</h2>
      </div>
      <ul className="admin-list admin-orders">
        {orders.map((order) => (
          <li key={order.id}>
            <div>
              <h4>{order.id}</h4>
              <p>{order.customer}</p>
            </div>
            <div className="admin-order-right">
              <strong>{order.total}</strong>
              <span className={`admin-status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminOrdersPage;
