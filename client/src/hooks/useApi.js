import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Backend URL

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get stored token
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  // Set token in localStorage
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  };

  // Set user data in localStorage
  const setUserData = (userData) => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  };

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  // Generic API call function
  const makeApiCall = async (endpoint, options = {}) => {
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

      console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
      console.log('Headers:', headers);

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
  };

  // Authentication API calls
  const authApi = {
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
      
      // Auto-login after verification
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        setUserData(data.data.user);
      }
      
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
    logout: () => {
      clearAuthData();
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
  };

  // Helper functions for checking authentication
  const isAuthenticated = () => {
    const token = getToken();
    const userData = getUserData();
    return !!(token && userData);
  };

  const isEmailVerified = () => {
    const userData = getUserData();
    return userData?.isEmailVerified || false;
  };

  const getRole = () => {
    const userData = getUserData();
    return userData?.role || 'user';
  };

  return {
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
  };
};

export default useApi; 