import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ResetPassword from '../pages/ResetPassword';
import SignupVerification from '../pages/SignUpVerification';
import ResetPasswordVerification from '../pages/ResetPasswordVerification';
import ForgotPassword from '../pages/ForgotPassword';
import ForgotPasswordVerification from '../pages/ForgotPasswordVerification';
import NewPassword from '../pages/NewPassword';
import PopUpPasswordChange from '../pages/PopUpPasswordChange';
import OAuthCallback from '../pages/OAuthCallback';

const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes - Redirect if already authenticated */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup-verification" 
            element={
              <PublicRoute>
                <SignupVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password-verification" 
            element={
              <PublicRoute>
                <ForgotPasswordVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password-verification" 
            element={
              <PublicRoute>
                <ResetPasswordVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/new-password" 
            element={
              <PublicRoute>
                <NewPassword />
              </PublicRoute>
            } 
          />
          
          {/* Special Routes */}
          <Route path="/password-success" element={<PopUpPasswordChange />} />
          <Route path="/login/callback" element={<OAuthCallback />} />
          
          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
                  <a href="/" className="btn-primary">Go Back Home</a>
                </div>
              </div>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter; 