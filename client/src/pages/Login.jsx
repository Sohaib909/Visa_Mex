import { useState, useEffect } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useNavigate, useLocation } from "react-router-dom"
import useApi from "../hooks/useApi"
import GoogleOAuthButton from "../components/GoogleOAuthButton"
import FacebookOAuthButton from "../components/FacebookOAuthButton"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { authApi, loading, error } = useApi()

  // Check for success message from navigation state
  useEffect(() => {
    const messageFromState = location.state?.message
    if (messageFromState) {
      setSuccessMessage(messageFromState)
      // Clear the message from navigation state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const response = await authApi.login({
        email: email.trim(),
        password: password
      })

      if (response.success) {
        // Navigate to home page on successful login
        navigate("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      
      // Handle specific error cases
      if (err.message.includes("verify your email")) {
        // If email needs verification, navigate to verification page
        navigate("/signup-verification", { 
          state: { 
            email: email.trim(),
            needsVerification: true 
          } 
        })
      }
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
    // Navigate to home on successful Google OAuth
    navigate("/")
  }

  const handleGoogleError = (error) => {
    console.error("Google OAuth error:", error)
    setError(error || "Google authentication failed")
  }

  const handleFacebookSuccess = (data) => {
    // Navigate to home on successful Facebook OAuth
    navigate("/")
  }

  const handleFacebookError = (error) => {
    console.error("Facebook OAuth error:", error)
    setError(error || "Facebook authentication failed")
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
        <div className="w-full max-w-6xl mx-auto h-full max-h-[85vh]">
          {/* Card Container */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              {/* Left Side - Login Form (40%) */}
              <div
                className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.57)",
                  backdropFilter: "blur(10.1px)",
                }}
              >
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  
                  {/* Login Title */}
                  <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl text-left pl-8 font-semibold font-sans mb-8" style={{ color: "#1B3276" }}>
                      Login
                    </h1>
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Login Form */}
                  <form className="space-y-5" onSubmit={handleLogin}>
                    
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: null }))
                          }
                        }}
                        className={`w-full px-5 py-4 bg-white/90 border rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm ${
                          errors.email ? 'border-red-500' : 'border-blue-700'
                        }`}
                        style={{
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

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: null }))
                          }
                        }}
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
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Reset Password and Forgot Password Links */}
                    <div className="flex justify-between text-sm font-sans">
                      <button
                        type="button"
                        className="hover:opacity-80 transition-colors font-medium font-sans"
                        style={{ color: "#5576D9" }}
                        onClick={handleResetPassword}
                        disabled={loading}
                      >
                        Reset password?
                      </button>
                      <button
                        type="button"
                        className="hover:opacity-80 transition-colors font-medium font-sans"
                        style={{ color: "#5576D9" }}
                        onClick={handleForgotPassword}
                        disabled={loading}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Login Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full text-white font-semibold font-sans py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: "#5576D9",
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#4a6bc7")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#5576D9")}
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Login"}
                      </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4">
                      <p className="text-gray-800 text-sm font-sans">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="hover:opacity-80 font-semibold font-sans transition-colors"
                          style={{ color: "#5576D9" }}
                          onClick={handleSignUp}
                          disabled={loading}
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </form>

                  {/* Blue "or" Divider */}
                  <div className="mt-6 mb-4">
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

              {/* Right Side - Brand Section (60%) - MATCHING NEW PASSWORD PAGE */}
              <div
                className="lg:col-span-3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden"
                style={{ backgroundColor: "#5576D9" }}
              >
                
                <div
                  className="absolute bottom-1 w-full h-1/2 bg-contain bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url('/loginbg2.png')`,
                    backgroundSize: "75% auto",
                  }}
                />

                <div className="relative mb-16 z-10 text-center">
                  {/* Logo/Brand Name */}
                  <div className="mb-8">
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

export default LoginPage
