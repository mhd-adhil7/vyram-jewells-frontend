import { createContext, useContext, useMemo, useState } from 'react';

const ADMIN_AUTH_KEY = 'vyram_admin_auth';
const DEMO_EMAIL = 'admin@vyramjewells.com';
const DEMO_PASSWORD = 'admin123';

const readInitialAuth = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(readInitialAuth);

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return {
        ok: false,
        error: 'Invalid credentials. Please check your email and password.'
      };
    }

    setIsAuthenticated(true);
    window.localStorage.setItem(ADMIN_AUTH_KEY, 'true');

    return {
      ok: true
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      demoCredentials: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD
      }
    }),
    [isAuthenticated]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }

  return context;
};
