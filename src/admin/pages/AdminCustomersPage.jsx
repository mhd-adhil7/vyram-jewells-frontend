const customers = [
  { name: 'Aarav Nair', email: 'aarav@example.com', orders: 12 },
  { name: 'Maya Iyer', email: 'maya@example.com', orders: 8 },
  { name: 'Neha Gupta', email: 'neha@example.com', orders: 6 },
  { name: 'Ravi Kumar', email: 'ravi@example.com', orders: 4 }
];

const AdminCustomersPage = () => {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Customers</h2>
      </div>
      <div className="admin-customers-grid">
        {customers.map((customer) => (
          <article key={customer.email} className="admin-customer-card">
            <h4>{customer.name}</h4>
            <p>{customer.email}</p>
            <span>{customer.orders} total orders</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminCustomersPage;
