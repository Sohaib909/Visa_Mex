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

  // Helper function to clear auth state
  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  }, [setError]);

  // Check authentication status on app startup
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const userData = localStorage.getItem('user') || localStorage.getItem('userData');

        console.log('Checking auth status:', { token: !!token, userData: !!userData });

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            console.log('Parsed user:', parsedUser);
            
            // Quick validation - check if user data is valid
            if (parsedUser && (parsedUser._id || parsedUser.id || parsedUser.email)) {
              setUser(parsedUser);
              setIsAuthenticated(true);
              console.log('User authenticated from localStorage');
            } else {
              console.log('Invalid user data, clearing auth state');
              clearAuthState();
            }
          } catch (parseError) {
            console.log('User data parse error:', parseError);
            clearAuthState();
          }
        } else {
          console.log('No token or user data found, clearing auth state');
          clearAuthState();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure localStorage is fully available
    const timeoutId = setTimeout(checkAuthStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [clearAuthState]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        const userData = response.data?.user || response.user;
        
        // The useApi hook already stores the token and user data
        // We just need to update the React state
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('Login successful, user data:', userData);
        
        return { success: true, user: userData };
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
    console.log('Logout initiated...');
    
    try {
      // Call API logout if available
      if (authApi && authApi.logout) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('API Logout error:', err);
    }
    
    // Always clear local state regardless of API call result
    clearAuthState();
    console.log('Logout completed, state cleared');
    
    return { success: true };
  }, [authApi, clearAuthState]);

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