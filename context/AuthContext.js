// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Here you would typically make an API call
      // For demo, we'll just store the email
      await SecureStore.setItemAsync('user', email);
      setUser({ email });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      // Here you would typically make an API call
      // For demo, we'll just store the email
      await SecureStore.setItemAsync('user', email);
      setUser({ email });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);