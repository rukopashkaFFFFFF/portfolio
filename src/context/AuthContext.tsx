import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { api, setToken, getToken } from '../api/client';

interface AdminUser {
  id: string;
  username: string;
}

interface AuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  admin: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setAdmin({ id: payload.adminId, username: payload.username });
        } else {
          setToken(null);
        }
      } catch {
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await api.auth.login(username, password);
    setToken(result.accessToken);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch { /* ignore */ }
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, isLoading, login, logout }), [admin, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}