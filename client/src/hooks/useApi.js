import { useState, useCallback, useMemo } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Token management
  const getToken = useCallback(() => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  }, []);

  const setToken = useCallback((token) => {
    localStorage.setItem('token', token);
    localStorage.removeItem('authToken');
  }, []);

  // User data management  
  const getUserData = useCallback(() => {
    try {
      const userData = localStorage.getItem('user') || localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  const setUserData = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('userData');
  }, []);

  // Clear all auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
  }, []);

  // Generic API call function
  const makeApiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };

      if (token && !options.skipAuth) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use the default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setLoading(false);
      return data;

    } catch (err) {
      console.error('API call error:', err);
      setLoading(false);
      const errorMessage = err.message || 'Network error - please check your connection';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [getToken]);

  // Authentication API calls
  const authApi = useMemo(() => ({
    // Step 1: Register user
    register: async (userData) => {
      const data = await makeApiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        skipAuth: true,
      });
      return data;
    },

    // Step 2: Verify email
    verifyEmail: async (verificationData) => {
      const data = await makeApiCall('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(verificationData),
        skipAuth: true,
      });
      
      // Don't auto-login after verification
      // Let user manually login after account creation
      
      return data;
    },

    // Resend verification code
    resendVerificationCode: async (email) => {
      const data = await makeApiCall('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      return data;
    },

    // Check registration status
    checkRegistrationStatus: async (email) => {
      const data = await makeApiCall(`/auth/registration-status/${encodeURIComponent(email)}`, {
        method: 'GET',
        skipAuth: true,
      });
      return data;
    },

    // Login
    login: async (credentials) => {
      const data = await makeApiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        skipAuth: true,
      });

      if (data.success && data.token) {
        setToken(data.token);
        setUserData(data.user);
      }

      return data;
    },

    // Logout
    logout: async () => {
      try {
        // Call server logout to clear session
        await makeApiCall('/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Server logout error:', error);
      } finally {
        // Always clear local auth data regardless of server response
        clearAuthData();
      }
    },

    // Check authentication status (checks both session and JWT)
    checkAuthStatus: async () => {
      try {
        const token = getToken();
        const headers = {};
        
        // Include JWT token if available
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // If we got a new token (session auth), store it
            if (data.token) {
              setToken(data.token);
            }
            
            // Always update user data
            setUserData(data.user);
            
            return {
              success: true,
              user: data.user,
              authMethod: data.authMethod
            };
          }
        }
        
        // If we reach here, authentication failed
        clearAuthData();
        return { success: false };
        
      } catch (error) {
        console.error('Auth status check error:', error);
        clearAuthData();
        return { success: false };
      }
    },

    // Forgot Password Flow
    forgotPassword: async (email) => {
      const data = await makeApiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      return data;
    },

    resetPassword: async (resetData) => {
      const data = await makeApiCall('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(resetData),
        skipAuth: true,
      });
      return data;
    },

    // Protected routes
    getProfile: async () => {
      const data = await makeApiCall('/auth/profile', {
        method: 'GET',
      });
      return data;
    },

    updateProfile: async (profileData) => {
      const data = await makeApiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (data.success && data.user) {
        setUserData(data.user);
      }

      return data;
    },

    changePassword: async (passwordData) => {
      const data = await makeApiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
      return data;
    },
  }), [makeApiCall, setToken, setUserData, clearAuthData]);

  // Helper functions for checking authentication
  const isAuthenticated = useCallback(() => {
    const token = getToken();
    const userData = getUserData();
    return !!(token && userData);
  }, [getToken, getUserData]);

  const isEmailVerified = useCallback(() => {
    const userData = getUserData();
    return userData?.isEmailVerified || false;
  }, [getUserData]);

  const getRole = useCallback(() => {
    const userData = getUserData();
    return userData?.role || 'user';
  }, [getUserData]);

  return useMemo(() => ({
    loading,
    error,
    authApi,
    isAuthenticated,
    isEmailVerified,
    getRole,
    getUserData,
    clearAuthData,
    makeApiCall,
    setError
  }), [
    loading,
    error,
    authApi,
    isAuthenticated,
    isEmailVerified,
    getRole,
    getUserData,
    clearAuthData,
    makeApiCall,
    setError
  ]);
};

export default useApi; 