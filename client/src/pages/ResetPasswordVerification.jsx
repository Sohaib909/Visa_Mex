import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useApi from "../hooks/useApi"
import useAuthLayout from "../hooks/useAuthLayout"

const ResetPasswordVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  
  const navigate = useNavigate()
  const location = useLocation()
  const { authApi } = useApi()

  // Get centralized layout configuration
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()

  // Get email from navigation state
  useEffect(() => {
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    } else {
      // If no email provided, redirect back to reset password
      navigate('/reset-password')
    }
  }, [location.state, navigate])

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const code = verificationCode.join("")
    if (code.length !== 4) {
      setError("Please enter the complete 4-digit verification code")
      return
    }

    setIsSubmitting(true)

    // Since the backend doesn't have a separate verification endpoint,
    // we'll just validate the code format and navigate to new password page
    // The actual verification will happen when the user sets the new password
    
    try {
      // Simple client-side validation before proceeding
      if (!/^\d{4}$/.test(code)) {
        setError("Please enter a valid 4-digit code")
        return
      }

      // Navigate to new password page with email and code
      navigate('/new-password', { 
        state: { 
          email: email,
          verificationCode: code 
        } 
      })

    } catch (err) {
      setError("Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) return
    
    setError("")
    try {
      await authApi.forgotPassword(email)
      setError("") // Clear any previous errors
      // You could show a success message here if needed
    } catch (err) {
      setError("Failed to resend code. Please try again.")
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
                    MEX<span className="font-light">VISA</span>
                  </h1>
                </div>

                {/* Welcome Message */}
                <div className={brand.textSpacing}>
                  <p className={typography.brandWelcome}>Welcome to</p>
                  <p className={typography.brandSubtitle}>MexVisa</p>
                </div>
              </div>
            </div>

            {/* Left Side - Verification Form (40%) - SECOND ON MOBILE */}
            <div
              className={`${grid.formSection} ${form.containerClasses} ${form.padding}`}
              style={{
                backgroundColor: form.background,
                backdropFilter: form.backdropFilter,
              }}
            >
              <div className={form.contentWrapper}>
                {/* Verification Title */}
                <div className={form.titleMargin}>
                  <h1 className={`${typography.title} text-left pl-2 sm:pl-4 lg:pl-8`} style={{ color: colors.title }}>
                    Verification
                  </h1>
                  <p className={`text-gray-600 ${typography.instruction} text-left pl-2 sm:pl-4 lg:pl-8 mt-2`}>
                    Enter the 4-digit code sent to {email}
                  </p>
                </div>

                {/* Verification Form */}
                <form className={form.formClasses} onSubmit={handleSubmit}>
                  {/* Verification Code Inputs */}
                  <div className="flex justify-left space-x-3 sm:space-x-4 lg:space-x-6 pl-0 sm:pl-2 lg:pl-6">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isSubmitting}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-white/90 border border-blue-800 rounded-full text-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          focusRingColor: colors.primary,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => (e.target.style.boxShadow = components.input.focusBoxShadow)}
                        onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className={`${components.message.error} mx-0 sm:mx-2 lg:mx-8`}>
                      {error}
                    </div>
                  )}

                  {/* Resend Code Text */}
                  <div className="text-left pl-0 sm:pl-2 lg:pl-8">
                    <p className={`text-gray-700 ${typography.instruction}`}>
                      If you didn't receive a code,{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isSubmitting}
                        className="hover:opacity-80 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: colors.primary }}
                      >
                        Resend
                      </button>
                    </p>
                  </div>

                  {/* Verify Button */}
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
                          Verifying...
                        </div>
                      ) : (
                        "Verify Code"
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

export default ResetPasswordVerificationPage
