import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useApi from '../hooks/useApi';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { authApi, loading: apiLoading, error, setError } = useApi();

  // Check authentication status on app startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userData = localStorage.getItem('user') || localStorage.getItem('userData');

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            // Quick validation - just check if token exists and user data is valid
            if (parsedUser && parsedUser._id) {
              setUser(parsedUser);
              setIsAuthenticated(true);
            } else {
              await logout();
            }
          } catch (parseError) {
            console.log('User data parse error:', parseError);
            await logout();
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user || response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user || response.user };
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const logout = useCallback(async () => {
    try {
      authApi.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      return { success: true };
    }
  }, [authApi]);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const verifyEmail = useCallback(async (verificationData) => {
    setError(null);
    try {
      const response = await authApi.verifyEmail(verificationData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Email verification failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const resendVerificationCode = useCallback(async (email) => {
    setError(null);
    try {
      const response = await authApi.resendVerificationCode(email);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend verification code.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const checkRegistrationStatus = useCallback(async (email) => {
    try {
      const response = await authApi.checkRegistrationStatus(email);
      return response;
    } catch (err) {
      console.error('Registration status check error:', err);
      return { success: false, error: err.message };
    }
  }, [authApi]);

  const forgotPassword = useCallback(async (email) => {
    setError(null);
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset code.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const resetPassword = useCallback(async (resetData) => {
    setError(null);
    try {
      const response = await authApi.resetPassword(resetData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Password reset failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [authApi, setError]);

  const value = useMemo(() => ({
    user,
    loading: loading || apiLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    verifyEmail,
    resendVerificationCode,
    checkRegistrationStatus,
    forgotPassword,
    resetPassword,
    setError
  }), [
    user,
    loading,
    apiLoading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    verifyEmail,
    resendVerificationCode,
    checkRegistrationStatus,
    forgotPassword,
    resetPassword,
    setError
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 