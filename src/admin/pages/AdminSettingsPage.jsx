const AdminSettingsPage = () => {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <h2>Settings</h2>
      </div>

      <form className="admin-settings-form">
        <label>
          Store Name
          <input type="text" defaultValue="Vyram Jewells" />
        </label>
        <label>
          Support Email
          <input type="email" defaultValue="support@vyramjewells.com" />
        </label>
        <label>
          Support Phone
          <input type="text" defaultValue="+1 (800) 123-4567" />
        </label>
        <label>
          Notifications
          <select defaultValue="all">
            <option value="all">All Notifications</option>
            <option value="orders">Orders Only</option>
            <option value="none">Disable Notifications</option>
          </select>
        </label>

        <button type="button">Save Changes</button>
      </form>
    </section>
  );
};

export default AdminSettingsPage;
