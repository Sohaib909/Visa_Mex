import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import useApi from "../hooks/useApi"

const NewPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  
  const navigate = useNavigate()
  const location = useLocation()
  const { authApi } = useApi()

  // Get email and verification code from navigation state
  useEffect(() => {
    const emailFromState = location.state?.email
    const codeFromState = location.state?.verificationCode
    
    if (emailFromState && codeFromState) {
      setEmail(emailFromState)
      setVerificationCode(codeFromState)
    } else {
      // If no data provided, redirect back to forgot password
      navigate('/forgot-password')
    }
  }, [location.state, navigate])

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authApi.resetPassword({
        email,
        verificationCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (response.success) {
        // Navigate to password success page
        navigate('/password-success')
      }

    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
              {/* Left Side - New Password Form (40%) */}
              <div
                className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.57)",
                  backdropFilter: "blur(10.1px)",
                }}
              >
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  {/* New Password Title */}
                  <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-semibold font-sans mb-2" style={{ color: "#1B3276" }}>
                      New Password
                    </h1>
                    <p className="text-gray-600 text-sm font-sans">
                      Enter your new password for {email}
                    </p>
                  </div>

                  {/* New Password Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* New Password Input */}
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 pr-14 bg-white/90 border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        disabled={isSubmitting}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                      >
                        {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 pr-14 bg-white/90 border border-gray-300 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        disabled={isSubmitting}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                      </div>
                    )}

                    {/* Confirm Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white font-semibold font-sans text-md py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: "#5576D9",
                        }}
                        onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = "#4a6bc7")}
                        onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = "#5576D9")}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Updating Password...
                          </div>
                        ) : (
                          "Confirm"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Side - Brand Section (60%) */}
              <div
                className="lg:col-span-3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden"
                style={{ backgroundColor: "#5576D9" }}
              >
                {/* Decorative Background Pattern */}
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
                    <p className="text-2xl sm:text-4xl font-light font-sans">Welcome to</p>
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

export default NewPasswordPage
