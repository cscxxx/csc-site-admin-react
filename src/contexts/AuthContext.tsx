import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContext';

const AUTH_TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 从 localStorage 读取初始登录状态
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  });

  const login = (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
  };

  // 监听 localStorage 变化（用于多标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) {
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
