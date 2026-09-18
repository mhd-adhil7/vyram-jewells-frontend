import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLoginPage = () => {
  const { isAuthenticated, login, demoCredentials } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const result = login({ email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <section className="admin-auth-shell">
      <div className="admin-auth-card">
        <img src="/assets/vyram-logo.png" alt="Vyram Jewells" />
        <h1>Admin Sign In</h1>
        <p>Sign in to access the admin dashboard.</p>

        <form className="admin-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">
            Email
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@vyramjewells.com"
              required
            />
          </label>

          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="admin-auth-error">{error}</p> : null}

          <button type="submit">Sign In</button>
        </form>

        <div className="admin-auth-hint">
          <p>Demo credentials</p>
          <code>{demoCredentials.email}</code>
          <code>{demoCredentials.password}</code>
        </div>

        <Link className="admin-auth-back" to="/">
          Back to Storefront
        </Link>
      </div>
    </section>
  );
};

export default AdminLoginPage;
