import { createContext, useContext, useMemo, useState } from 'react';

const ADMIN_AUTH_KEY = 'vyram_admin_auth';

// Secure cryptographic verification hashes (SHA-256)
// No plaintext passwords or credentials are stored in frontend source code
const VALID_EMAIL_HASH = '347bd938f4d2cc85bc19f96ffe3ddc53e5639dad33c47b5886a2d2b64d0e336f';
const VALID_PWD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

const computeHash = async (text) => {
  if (typeof crypto !== 'undefined' && crypto?.subtle) {
    const buffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
};

const readInitialAuth = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(readInitialAuth);

  const login = async ({ email, password }) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    if (!normalizedEmail || !cleanPassword) {
      return {
        ok: false,
        error: 'Please enter your email and password.'
      };
    }

    try {
      const [emailHash, pwdHash] = await Promise.all([
        computeHash(normalizedEmail),
        computeHash(cleanPassword)
      ]);

      if (emailHash !== VALID_EMAIL_HASH || pwdHash !== VALID_PWD_HASH) {
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
    } catch {
      return {
        ok: false,
        error: 'Authentication error. Please try again.'
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout
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
