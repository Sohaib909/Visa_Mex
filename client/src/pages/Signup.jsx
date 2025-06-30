import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import GoogleOAuthButton from "../components/GoogleOAuthButton"
import FacebookOAuthButton from "../components/FacebookOAuthButton"
import useAuthLayout from "../hooks/useAuthLayout"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    signUpAsAgency: false,
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Mobile number is required"
    } else if (!/^\+?[0-9]{7,20}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Mobile number is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validateForm()) {
      return false
    }

    try {
      const response = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        signUpAsAgency: formData.signUpAsAgency
      })

      if (response.success) {
        // Navigate to verification page with email
        navigate("/signup-verification", { 
          state: { 
            email: formData.email.trim(),
            firstName: formData.firstName.trim()
          } 
        })
      }
    } catch (err) {
      console.error("Registration error:", err)
    }
  }

  const handleSignIn = () => {
    navigate("/login")
  }

  const handleGoogleSuccess = (data) => {
    
    navigate("/")
  }

  const handleGoogleError = (error) => {
    console.error("Google OAuth error:", error)
    
  }

  const handleFacebookSuccess = (data) => {
    navigate("/")
  }

  const handleFacebookError = (error) => {
    console.error("Facebook OAuth error:", error)
    // Could set an error state here if needed
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

            {/* Left Side - Signup Form (40%) - SECOND ON MOBILE */}
            <div
              className={`${grid.formSection} ${form.containerClasses} ${form.padding}`}
              style={{
                backgroundColor: form.background,
                backdropFilter: form.backdropFilter,
                maxHeight: '100vh',
                overflow: 'hidden',
              }}
            >
              <div className={`${form.contentWrapper} flex flex-col justify-center h-full`}>
                {/* Welcome Text */}
                <div className={form.titleMargin}>
                  <h1 className={typography.title} style={{ color: colors.title }}>
                    Create your account!
                  </h1>
                </div>

              
                {error && (
                  <div className={`mb-4 ${components.message.error}`}>
                    {error}
                  </div>
                )}

                {/* Signup Form */}
                <form 
                  className="space-y-2 sm:space-y-3 lg:space-y-3" 
                  onSubmit={handleNext}
                  noValidate
                  autoComplete="off"
                  action="javascript:void(0)"
                >
                  
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${components.input.classes} ${errors.firstName ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.firstName && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.firstName}</p>
                    )}
                  </div>

                  
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${components.input.classes} ${errors.lastName ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.lastName && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.lastName}</p>
                    )}
                  </div>

                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
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

                  
                  <div>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Mobile Number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`${components.input.classes} ${errors.phoneNumber ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.phoneNumber && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    {errors.phoneNumber && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.phoneNumber}</p>
                    )}
                  </div>

                  
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter New Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${components.input.classes} ${errors.password ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.password && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                    {errors.password && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.password}</p>
                    )}
                  </div>

                  
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${components.input.classes} ${errors.confirmPassword ? 'border-red-500' : 'border-blue-700'}`}
                      style={components.input.focusStyle}
                      onFocus={(e) => !errors.confirmPassword && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                    {errors.confirmPassword && (
                      <p className={`mt-1 ${typography.message} text-red-600`}>{errors.confirmPassword}</p>
                    )}
                  </div>

                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`${components.button.classes} rounded-xl`}
                      style={components.button.style}
                      onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = components.button.hoverColor)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = colors.primary)}
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Next"}
                    </button>
                  </div>

                  {/* Agency Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      name="signUpAsAgency"
                      id="signUpAsAgency"
                      checked={formData.signUpAsAgency}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      style={{ accentColor: colors.primary }}
                      disabled={loading}
                    />
                    <label htmlFor="signUpAsAgency" className={`ml-3 text-gray-800 ${typography.instruction} font-sans`}>
                      Sign up as agency
                    </label>
                  </div>
                </form>

                
                <div className="mt-3 text-center">
                  <p className={`text-gray-800 ${typography.instruction} font-sans`}>
                    I have an account?{" "}
                    <button 
                      className="hover:opacity-80 font-semibold font-sans transition-colors" 
                      style={{ color: colors.primary }}
                      onClick={handleSignIn}
                      disabled={loading}
                    >
                      Sign In
                    </button>
                  </p>
                </div>

              
                <div className="mt-3 mb-3">
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

export default SignupPage
