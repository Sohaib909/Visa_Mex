import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && user) {
      try {
        // Store token and user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', decodeURIComponent(user));
        
        // Redirect to home page
        navigate('/');
      } catch (err) {
        console.error('Error processing OAuth callback:', err);
        navigate('/login?error=oauth_processing_failed');
      }
    } else {
      // Missing required parameters
      navigate('/login?error=oauth_invalid_callback');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback; 