import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import useApi from "../hooks/useApi"
import useAuthLayout from "../hooks/useAuthLayout"

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

  // Get centralized layout configuration
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()

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
        // Navigate back to login with success message and flag
        navigate('/login', { 
          state: { 
            message: "Password successfully updated! Please login with your new password.",
            fromPasswordReset: true
          } 
        })
      }

    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
                    MEX<span className="font-light font-sans">VISA</span>
                  </h1>
                </div>

              
                <div className={brand.textSpacing}>
                  <p className={typography.brandWelcome}>Welcome to</p>
                  <p className={typography.brandSubtitle}>MexVisa</p>
                </div>
              </div>
            </div>

            {/* Left Side - New Password Form (40%) - SECOND ON MOBILE */}
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
                    New Password
                  </h1>
                  <p className={`text-gray-600 ${typography.instruction} mt-2`}>
                    Enter your new password for {email}
                  </p>
                </div>

                {/* New Password Form */}
                <form className={form.formClasses} onSubmit={handleSubmit}>
                  
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter New Password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`${components.input.classes} pr-12 sm:pr-14`}
                      style={components.input.focusStyle}
                      onFocus={(e) => (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      disabled={isSubmitting}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {showNewPassword ? <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>

                  
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={`${components.input.classes} pr-12 sm:pr-14`}
                      style={components.input.focusStyle}
                      onFocus={(e) => (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isSubmitting}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>

                  
                  {error && (
                    <div className={components.message.error}>
                      {error}
                    </div>
                  )}

                  {/* Confirm Button */}
                  <div className={components.button.topMargin}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={components.button.classes}
                      style={components.button.style}
                      onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = components.button.hoverColor)}
                      onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.primary)}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className={`animate-spin rounded-full ${components.spinner.small} border-b-2 border-white mr-2`}></div>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPasswordPage
