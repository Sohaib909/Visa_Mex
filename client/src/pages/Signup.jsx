import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import useApi from "../hooks/useApi"
import GoogleOAuthButton from "../components/GoogleOAuthButton"
import FacebookOAuthButton from "../components/FacebookOAuthButton"

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    signUpAsAgency: false,
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { authApi, loading, error } = useApi()

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
    
    if (!validateForm()) {
      return
    }

    try {
      const response = await authApi.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
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
    // Navigate to home on successful Google OAuth
    navigate("/")
  }

  const handleGoogleError = (error) => {
    console.error("Google OAuth error:", error)
    // Could set an error state here if needed
  }

  const handleFacebookSuccess = (data) => {
    // Navigate to home on successful Facebook OAuth
    navigate("/")
  }

  const handleFacebookError = (error) => {
    console.error("Facebook OAuth error:", error)
    // Could set an error state here if needed
  }

  return (
    <div className="h-screen w-full relative overflow-hidden font-['Montserrat']">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image.jpg')`,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 h-screen flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="w-full max-w-6xl mx-auto h-full max-h-[95vh]">
          {/* Card Container */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              {/* Left Side - Signup Form (40%) */}
              <div
                className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative overflow-y-auto"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.57)",
                  backdropFilter: "blur(10.1px)",
                }}
              >
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  {/* Welcome Text */}
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold font-sans mb-2" style={{ color: "#1B3276" }}>
                      Create your account!
                    </h1>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Signup Form */}
                  <form className="space-y-3" onSubmit={handleNext}>
                    {/* First Name Input */}
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.firstName ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.firstName && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                        disabled={loading}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name Input */}
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.lastName ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.lastName && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                        disabled={loading}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.email ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.email && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter New Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.password ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.password && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.confirmPassword ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.confirmPassword && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Next Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full text-white font-semibold font-sans py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: "#5576D9",
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#4a6bc7")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#5576D9")}
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
                        style={{ accentColor: "#5576D9" }}
                        disabled={loading}
                      />
                      <label htmlFor="signUpAsAgency" className="ml-3 text-sm text-gray-800 font-sans">
                        Sign up as agency
                      </label>
                    </div>
                  </form>

                  {/* Sign In Link */}
                  <div className="mt-4 text-center">
                    <p className="text-gray-800 text-sm font-sans">
                      I have an account?{" "}
                      <button 
                        className="hover:opacity-80 font-semibold font-sans transition-colors" 
                        style={{ color: "#5576D9" }}
                        onClick={handleSignIn}
                        disabled={loading}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>

                  {/* Blue "or" Divider */}
                  <div className="mt-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-500 font-sans font-bold"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span
                          className="p-2 px-3 text-white text-sm font-medium rounded-full"
                          style={{ backgroundColor: "#5576D9" }}
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
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Brand Section (60%) */}
              <div
                className="lg:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center text-white relative overflow-hidden"
                style={{ backgroundColor: "#5576D9" }}
              >
                {/* Decorative Background Pattern */}
                <div
                  className="absolute bottom-1 w-full h-1/2 bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url('/loginbg2.png')`,
                    backgroundSize: "80% auto",
                  }}
                />

                <div className="relative mb-16 z-10 text-center">
                  {/* Logo/Brand Name */}
                  <div className="mb-12">
                    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-sans tracking-wider">
                      MEX<span className="font-light font-sans">VISA</span>
                    </h1>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-3">
                    <p className="text-2xl sm:text-4xl font-light font-sans ">Welcome to</p>
                    <p className="text-3xl sm:text-4xl font-bold font-sans">MexVisa</p>
                  </div>
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
