import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import GoogleOAuthButton from "../components/GoogleOAuthButton"
import FacebookOAuthButton from "../components/FacebookOAuthButton"
import useAuthLayout from "../hooks/useAuthLayout"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, setError } = useAuth()

  // Get centralized layout configuration
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()

  // Get success message from location state (from verification page)
  const successMessage = location.state?.message
  
  // Check if user is returning from password reset flows
  const isReturningUser = location.state?.fromPasswordReset

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Clear validation errors and auth errors at start of submission
    setErrors({})
    setError(null)
    
    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      const response = await login(formData.email.trim(), formData.password)

      if (response && response.success) {
        navigate("/")
      }
      // If login fails, error will be set by AuthContext
    } catch (err) {
      console.error("Login error:", err)
      
      // Handle specific error cases
      if (err.message && err.message.includes("verify your email")) {
        navigate("/signup-verification", { 
          state: { 
            email: formData.email.trim(),
            needsVerification: true 
          } 
        })
      }
      // For other errors, they will be displayed via AuthContext
    }
  }

  const handleResetPassword = () => {
    navigate("/reset-password")
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password")
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleGoogleSuccess = (data) => {
    
    navigate("/")
  }

  const handleGoogleError = (error) => {
    console.error("Google OAuth error:", error)
    setError(error || "Google authentication failed")
  }

  const handleFacebookSuccess = (data) => {
    
    navigate("/")
  }

  const handleFacebookError = (error) => {
    console.error("Facebook OAuth error:", error)
    setError(error || "Facebook authentication failed")
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden font-['Montserrat']">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image.jpg')`,
        }}
      />

      {/* Main Container */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center ${container.padding}`}>
        <div 
          className={container.classes}
          style={container.styles}
        >
          {/* Card Container */}
          <div className={grid.container}>
            {/* Right Side - Brand Section (60%) - FIRST ON MOBILE */}
            <div
              className={`${grid.brandSection} ${brand.containerClasses} ${brand.padding}`}
              style={{ backgroundColor: brand.background }}
            >
              {/* Decorative Background Pattern */}
              <div
                className={brand.backgroundPattern.classes}
                style={brand.backgroundPattern.style}
              />

              <div className={`relative ${brand.contentMargin} z-10 text-center`}>
                {/* Logo/Brand Name */}
                <div className={brand.logoMargin}>
                  <h1 className={typography.brandLogo}>
                    MEX<span className="font-light">VISA</span>
                  </h1>
                </div>

              
                <div className={brand.textSpacing}>
                  <p className={typography.brandWelcome}>Welcome to</p>
                  <p className={typography.brandSubtitle}>MexVisa</p>
                </div>
              </div>
            </div>

            {/* Left Side - Login Form (40%) - SECOND ON MOBILE */}
            <div
              className={`${grid.formSection} ${form.containerClasses} ${form.padding}`}
              style={{
                backgroundColor: form.background,
                backdropFilter: form.backdropFilter,
              }}
            >
              <div className={form.contentWrapper}>
                
                
                <div className={form.titleMargin}>
                  <h1 className={typography.title} style={{ color: colors.title }}>
                    {isReturningUser ? "Hi, Welcome Back!" : "Login"}
                  </h1>
                </div>

                
                {successMessage && (
                  <div className={`mb-4 ${components.message.success}`}>
                    {successMessage}
                  </div>
                )}

                {/* Login Form */}
                <form 
                  className={form.formClasses} 
                  onSubmit={handleLogin}
                  noValidate
                >
                  
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }))
                        // Only clear validation errors for this field, not auth errors
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: null }))
                        }
                      }}
                      className={`${components.input.classes} ${errors.email ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.email && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.email}</p>
                    )}
                  </div>

                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }))
                        // Only clear validation errors for this field, not auth errors
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: null }))
                        }
                      }}
                      className={`${components.input.classes} ${errors.password ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.password && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {errors.password && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.password}</p>
                    )}
                  </div>

                  {/* Error Message - Positioned between password field and reset links as per Figma */}
                  {error && (
                    <div className={`${components.message.error} mt-4 mb-4`}>
                      {error}
                    </div>
                  )}

                  {/* Reset Password and Forgot Password Links */}
                  <div className={`flex justify-between ${typography.instruction} font-sans`}>
                    <button
                      type="button"
                      className="hover:opacity-80 transition-colors font-medium font-sans"
                      style={{ color: colors.primary }}
                      onClick={handleResetPassword}
                      disabled={loading}
                    >
                      Reset password?
                    </button>
                    <button
                      type="button"
                      className="hover:opacity-80 transition-colors font-medium font-sans"
                      style={{ color: colors.primary }}
                      onClick={handleForgotPassword}
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>

                  
                  <div className={components.button.topMargin}>
                    <button
                      type="submit"
                      className={components.button.classes}
                      style={components.button.style}
                      onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = components.button.hoverColor)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = colors.primary)}
                      disabled={loading}
                    >
                      {loading ? "Signing In..." : "Login"}
                    </button>
                  </div>

                  
                  <div className="text-center pt-4">
                    <p className={`text-gray-800 ${typography.instruction} font-sans`}>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="hover:opacity-80 font-semibold font-sans transition-colors"
                        style={{ color: colors.primary }}
                        onClick={handleSignUp}
                        disabled={loading}
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </form>

                
                <div className="mt-6 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-500 font-sans font-bold"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span
                        className={`p-2 px-3 text-white ${typography.instruction} font-medium rounded-full`}
                        style={{ backgroundColor: colors.primary }}
                      >
                        or
                      </span>
                    </div>
                  </div>
                </div>

                {/* OAuth Buttons */}
                <div className="flex justify-center space-x-3">
                  <button 
                    onClick={() => {
                      // Redirect to Google OAuth
                      const googleAuthUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
                      window.location.href = googleAuthUrl;
                    }}
                    className="w-10 h-10 bg-white rounded-full border border-blue-800 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      // Redirect to Facebook OAuth
                      const facebookAuthUrl = `${import.meta.env.VITE_API_URL}/auth/facebook`;
                      window.location.href = facebookAuthUrl;
                    }}
                    className="w-10 h-10 bg-white rounded-full border border-blue-800 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
