import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Debug logging
  console.log('AuthProvider render:', { isLoading, isAuthenticated, hasUser: !!user });

  // Initialize auth state from localStorage
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser && isMounted) {
          const parsedUser = JSON.parse(storedUser);
          
          // First set the user from localStorage to avoid flash
          setUser(parsedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
          
          // Then verify token is still valid by calling profile endpoint
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sih-2025-471306.el.r.appspot.com/api'}/admin/profile`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok && isMounted) {
              // Token is invalid, clear storage
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
              setUser(null);
              setToken(null);
              setIsAuthenticated(false);
            } else if (response.ok && isMounted) {
              const data = await response.json();
              setUser(data.user);
            }
          } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            // Keep the user logged in if verification fails due to network issues
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sih-2025-471306.el.r.appspot.com/api'}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    return user && user.permissions && user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
