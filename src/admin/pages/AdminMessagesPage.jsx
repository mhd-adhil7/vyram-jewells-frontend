const messages = [
  { from: 'Priya', subject: 'Custom bridal set', time: '2m ago' },
  { from: 'Saanvi', subject: 'Order delivery update', time: '14m ago' },
  { from: 'Rahul', subject: 'Ring size exchange', time: '38m ago' },
  { from: 'Ananya', subject: 'Store appointment', time: '1h ago' }
];

const AdminMessagesPage = () => {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Messages</h2>
      </div>
      <ul className="admin-list">
        {messages.map((message) => (
          <li key={`${message.from}-${message.subject}`}>
            <div>
              <h4>{message.from}</h4>
              <p>{message.subject}</p>
            </div>
            <span>{message.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminMessagesPage;
