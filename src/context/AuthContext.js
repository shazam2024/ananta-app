import React, { createContext, useState, useContext, useEffect } from 'react';
import dbManager from '../utils/db';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        try {
          const userData = await dbManager.getUser(storedEmail);
          setUser(userData);
        } catch (error) {
          console.error('Error checking authentication:', error);
          localStorage.removeItem('userEmail');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await dbManager.getUser(email);
      if (userData && userData.password === password) {
        setUser(userData);
        localStorage.setItem('userEmail', email);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const existingUser = await dbManager.getUser(email);
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      await dbManager.addUser(newUser);
      setUser(newUser);
      localStorage.setItem('userEmail', email);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
