import { useNavigate } from 'react-router-dom';

const FacebookOAuthButton = ({ onSuccess, onError, text = "Continue with Facebook" }) => {
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    // Store the current page URL to return to after OAuth
    sessionStorage.setItem('oauth_return_url', window.location.pathname);
    
    // Redirect to Facebook OAuth endpoint
    const facebookAuthUrl = `${import.meta.env.VITE_API_URL}/auth/facebook`;
    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="w-full">
      <button
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
        style={{
          background: 'white',
          border: '1px solid #d1d5db',
        }}
      >
        {/* Facebook Icon */}
        <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center">
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        
        <span className="text-sm font-medium text-gray-600">
          {text}
        </span>
      </button>
    </div>
  );
};

export default FacebookOAuthButton; 