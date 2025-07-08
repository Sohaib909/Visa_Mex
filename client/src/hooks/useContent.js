import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Custom hook for fetching content by section
export const useContent = (section, options = {}) => {
  const { currentLanguage } = useLanguage();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    autoFetch = true,
    fallbackToEN = true,
    cacheTimeout = 5 * 60 * 1000 // 5 minutes
  } = options;

  const fetchContent = useCallback(async (sectionName, language) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/content/${sectionName}/${language || currentLanguage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // If language-specific content not found and fallback enabled, try English
        if (response.status === 404 && fallbackToEN && language !== 'EN') {
          return fetchContent(sectionName, 'EN');
        }
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setContent(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch content');
      }
    } catch (err) {
      console.error('Content fetch error:', err);
      setError(err.message);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, fallbackToEN]);

  // Auto-fetch content when section or language changes
  useEffect(() => {
    if (autoFetch && section) {
      fetchContent(section);
    }
  }, [section, currentLanguage, autoFetch, fetchContent]);

  // Manual refetch function
  const refetch = useCallback(() => {
    if (section) {
      fetchContent(section);
    }
  }, [section, fetchContent]);

  return {
    content,
    loading,
    error,
    refetch,
    fetchContent: (newSection) => fetchContent(newSection || section)
  };
};

// Hook for specific content types
export const useHeroContent = () => {
  const { content, loading, error, refetch } = useContent('hero');
  
  // Transform content into hero-specific format
  const heroData = {
    title: content.find(item => item.type === 'title')?.data?.text || '',
    subtitle: content.find(item => item.type === 'subtitle')?.data?.text || '',
    ctaText: content.find(item => item.type === 'cta')?.data?.buttonText || ''
  };

  return { heroData, loading, error, refetch };
};

export const useFeatures = () => {
  const { content, loading, error, refetch } = useContent('features');
  
  // Transform content into features format
  const features = content
    .filter(item => item.type === 'feature')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(item => ({
      id: item._id,
      title: item.data?.title || '',
      description: item.data?.description || '',
      iconUrl: item.data?.iconUrl || '',
      order: item.order || 0
    }));

  return { features, loading, error, refetch };
};

export const useTestimonials = () => {
  const { content, loading, error, refetch } = useContent('testimonials');
  
  // Transform content into testimonials format
  const testimonials = content
    .filter(item => item.type === 'testimonial')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(item => ({
      id: item._id,
      name: item.data?.name || '',
      text: item.data?.text || '',
      image: item.data?.image || '/Pic.png',
      rating: item.data?.rating || 5,
      order: item.order || 0
    }));

  return { testimonials, loading, error, refetch };
};

export const useFAQs = () => {
  const { content, loading, error, refetch } = useContent('faq');
  
  // Transform content into FAQ format
  const faqs = content
    .filter(item => item.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(item => ({
      id: item._id,
      question: item.data?.question || '',
      answer: item.data?.answer || '',
      order: item.order || 0
    }));

  return { faqs, loading, error, refetch };
};

// Hook for admin content management
export const useAdminContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const createContent = async (contentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/admin/content`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create content');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id, contentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(contentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update content');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/admin/content/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete content');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllContent = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${API_BASE_URL}/admin/content${queryParams ? `?${queryParams}` : ''}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch content');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createContent,
    updateContent,
    deleteContent,
    getAllContent
  };
}; 