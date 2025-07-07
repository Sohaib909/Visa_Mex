import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import AboutUs from '../pages/AboutUs';
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
import NotFound from '../components/NotFound';

const AppRouter = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
          {/* Public Routes - Default Landing Page */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes - Redirect if already authenticated */}
          <Route 
            path="/login" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup-verification" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <SignupVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password-verification" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <ForgotPasswordVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <ResetPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password-verification" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <ResetPasswordVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/new-password" 
            element={
              <PublicRoute redirectTo="/dashboard">
                <NewPassword />
              </PublicRoute>
            } 
          />
          
          {/* Special Routes */}
          <Route path="/password-success" element={<PopUpPasswordChange />} />
          <Route path="/login/callback" element={<OAuthCallback />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default AppRouter; 