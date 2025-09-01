"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

  // Verificar token no localStorage ao carregar
  useEffect(() => {
    const savedToken = localStorage.getItem('mangazinho_token');
    if (savedToken) {
      setToken(savedToken);
      // Chamar verifyToken diretamente para evitar dependência circular
      const checkToken = async () => {
        try {
          const response = await fetch(`${apiBase}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token inválido, limpar
            setUser(null);
            setToken(null);
            localStorage.removeItem('mangazinho_token');
          }
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('mangazinho_token');
        } finally {
          setLoading(false);
        }
      };
      checkToken();
    } else {
      setLoading(false);
    }
  }, [apiBase]);

  const verifyToken = useCallback(async (tokenToVerify) => {
    try {
      const response = await fetch(`${apiBase}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token inválido, limpar
        logout();
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('mangazinho_token', data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('mangazinho_token', data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mangazinho_token');
  };

  const isAdmin = () => {
    return user && user.role === 1;
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
