import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header with Logout Button */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Welcome to <span className="text-blue-600">Visa-Mex</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your trusted partner for visa applications to Mexico. 
            Streamline your visa application process with our comprehensive 
            digital platform designed to make your journey simple and efficient.
          </p>
          
           
        </div>
        
        
        
         
      </div>
    </div>
  );
};

export default Home; 