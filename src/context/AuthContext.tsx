
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, we would call the backend login endpoint here
      // For now, we'll simulate a successful login with static data
      // TODO: Replace with actual API call when backend authentication is implemented
      
      // For demo purposes, determine user role from email
      const role = email.includes('recruiter') ? 'recruiter' : 
                 email.includes('admin') ? 'admin' : 'applicant';
      
      const userData: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        createdAt: new Date().toISOString(),
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, we would call the backend registration endpoint here
      // For now, we'll simulate a successful registration with static data
      // TODO: Replace with actual API call when backend authentication is implemented
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || '',
        role: userData.role || 'applicant',
        createdAt: new Date().toISOString(),
        avatar: `https://i.pravatar.cc/150?u=${userData.email}`
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error('Registration failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
