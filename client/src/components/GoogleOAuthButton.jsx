import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthButton = ({ onSuccess, onError, text = "Continue with Google" }) => {
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google OAuth JavaScript library
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleAuth();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGoogleAuth;
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
        if (onError) onError('Failed to load Google authentication');
      };
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          width: '100%',
          logo_alignment: 'left',
        });
      }
    };

    const handleCredentialResponse = async (response) => {
      try {
        // Send the credential to our backend
        const backendResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        });

        const data = await backendResponse.json();

        if (data.success) {
          // Store token and user data (using consistent naming)
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (onSuccess) {
            onSuccess(data);
          } else {
            navigate('/');
          }
        } else {
          throw new Error(data.message || 'Google authentication failed');
        }
      } catch (error) {
        console.error('Google OAuth error:', error);
        if (onError) {
          onError(error.message || 'Authentication failed');
        }
      }
    };

    loadGoogleScript();

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.remove();
      }
    };
  }, [onSuccess, onError, navigate]);

  return (
    <div className="w-full">
      <div
        ref={googleButtonRef}
        className="w-full flex justify-center"
      />
    </div>
  );
};

export default GoogleOAuthButton; 