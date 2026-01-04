import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: 'patient-1',
    email: 'patient@demo.com',
    role: 'patient',
    fullName: 'John Patient',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    nationalId: 'NAT123456',
    createdAt: new Date().toISOString(),
    is2FAEnabled: false,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'doctor-1',
    email: 'doctor@demo.com',
    role: 'doctor',
    fullName: 'Dr. Sarah Smith',
    phone: '+1234567891',
    createdAt: new Date().toISOString(),
    is2FAEnabled: false,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    role: 'admin',
    fullName: 'Admin User',
    phone: '+1234567892',
    createdAt: new Date().toISOString(),
    is2FAEnabled: false,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('med_connect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      setUser(foundUser);
      localStorage.setItem('med_connect_user', JSON.stringify(foundUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `${data.role}-${Date.now()}`,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        nationalId: data.nationalId,
        createdAt: new Date().toISOString(),
        is2FAEnabled: false,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`
      };

      setUser(newUser);
      localStorage.setItem('med_connect_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('med_connect_user');
  };

  const verifyOTP = async (otp: string) => {
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        verifyOTP,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
