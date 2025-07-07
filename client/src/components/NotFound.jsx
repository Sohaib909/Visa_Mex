import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {t?.common?.pageNotFound || 'Page Not Found'}
          </h2>
          <p className="text-gray-600 mb-8">
            {t?.common?.pageNotFoundDesc || 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>
        
        <button
          onClick={handleGoBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          {t?.common?.goBack || 'Go Back'}
        </button>
      </div>
    </div>
  );
};

export default NotFound; 