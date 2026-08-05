import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/schema';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  updateUser: (updatedData: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kw_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kw_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kw_auth_user');
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    const apiRes = await authApi.login(email, pass);

    if (apiRes.success && apiRes.data?.user) {
      const apiUser = apiRes.data.user;
      const roleLower = (apiUser.role || 'ADMIN').toLowerCase() as 'admin' | 'editor' | 'viewer';
      const formattedUser: User = {
        id: apiUser.id,
        full_name: apiUser.full_name || (apiUser as any).fullName || 'Admin User',
        email: apiUser.email,
        role: roleLower,
        avatar_url: apiUser.avatar_url,
        is_active: apiUser.is_active,
        last_login_at: apiUser.last_login_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      setUser(formattedUser);
      return { success: true, message: apiRes.message || 'Login successful' };
    }

    return {
      success: false,
      message: apiRes.message || 'ការចូលប្រព័ន្ធមិនបានសម្រេច (Login failed)',
    };
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('kw_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
