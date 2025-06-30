import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import useAuthLayout from "../hooks/useAuthLayout"

const SignupVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendVerificationCode, loading, error } = useAuth()
  
  // Get centralized layout configuration
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()
  
  // Get email from location state or redirect to signup
  const email = location.state?.email
  const firstName = location.state?.firstName || ""
  const needsVerification = location.state?.needsVerification || false

  useEffect(() => {
    if (!email) {
      // If no email provided, redirect to signup
      navigate("/register")
    }
  }, [email, navigate])

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Clear errors when user starts typing
      if (errors.verificationCode) {
        setErrors(prev => ({ ...prev, verificationCode: null }))
      }

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

  const validateForm = () => {
    const newErrors = {}
    const code = verificationCode.join("")

    if (code.length !== 4) {
      newErrors.verificationCode = "Please enter all 4 digits"
    } else if (!/^\d{4}$/.test(code)) {
      newErrors.verificationCode = "Verification code must be 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const code = verificationCode.join("")
      const response = await verifyEmail({
        email: email,
        verificationCode: code
      })

      if (response.success) {
        // Navigate to login page after successful verification
        // Don't auto-login, let user login manually
        navigate("/login", { 
          state: { 
            message: "Congratulations! Your account has been created and verified successfully. Please login with your credentials.",
            email: email 
          } 
        })
      }
    } catch (err) {
      console.error("Verification error:", err)
      
      // Handle specific error cases
      if (err.message.includes("expired")) {
        setErrors({ verificationCode: "Verification code has expired. Please request a new one." })
      } else if (err.message.includes("Invalid")) {
        setErrors({ verificationCode: "Invalid verification code. Please try again." })
      } else if (err.message.includes("Too many failed attempts")) {
        setErrors({ verificationCode: "Too many failed attempts. Please register again." })
      } else if (err.message.includes("No pending registration")) {
        setErrors({ verificationCode: "Registration session expired. Please register again." })
      }
    }
  }

  const handleResend = async () => {
    try {
      const response = await resendVerificationCode(email)
      
      if (response.success) {
        // Clear any existing codes
        setVerificationCode(["", "", "", ""])
        setErrors({})
        
        // Show success message (you can add a toast notification here)
        console.log("New verification code sent!")
      }
    } catch (err) {
      console.error("Resend error:", err)
    }
  }

  if (!email) {
    return null // Will redirect to signup
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
                  <p className={`text-gray-600 ${typography.instruction} text-left pl-2 sm:pl-4 lg:pl-8 mt-2`}>Enter the 4-digit verification code</p>
                  <p className={`text-gray-500 ${typography.instruction} text-left pl-2 sm:pl-4 lg:pl-8 mt-1`}>
                    We sent a verification code to <span className="font-semibold">{email}</span>
                  </p>
                  <p className={`text-blue-600 ${typography.instruction} text-left pl-2 sm:pl-4 lg:pl-8 mt-1 font-medium`}>
                    Your account will be created once you verify your email
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`${components.message.error} mb-4`}>
                    {error}
                  </div>
                )}

                {/* Verification Form */}
                <form className={form.formClasses} onSubmit={handleSignUp}>
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
                        className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold font-sans bg-white/90 border rounded-full text-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm ${
                          errors.verificationCode ? 'border-red-500' : 'border-blue-800'
                        }`}
                        style={{
                          focusRingColor: colors.primary,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => !errors.verificationCode && (e.target.style.boxShadow = components.input.focusBoxShadow)}
                        onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                        maxLength={1}
                        disabled={loading}
                      />
                    ))}
                  </div>

                  {/* Error Message for verification code */}
                  {errors.verificationCode && (
                    <div className="text-left pl-0 sm:pl-2 lg:pl-8">
                      <p className={`text-red-600 ${typography.instruction}`}>{errors.verificationCode}</p>
                    </div>
                  )}

                  {/* Resend Code Text */}
                  <div className="text-left pl-0 sm:pl-2 lg:pl-8">
                    <p className={`text-gray-700 ${typography.instruction}`}>
                      If you didn't receive a code,{" "}
                      <button
                        type="button"
                        className="hover:opacity-80 font-semibold transition-colors disabled:opacity-50"
                        style={{ color: colors.primary }}
                        onClick={handleResend}
                        disabled={loading}
                      >
                        Resend
                      </button>
                    </p>
                  </div>

                  {/* Sign Up Button */}
                  <div className={components.button.topMargin}>
                    <button
                      type="submit"
                      className={components.button.classes}
                      style={components.button.style}
                      onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = components.button.hoverColor)}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = colors.primary)}
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : needsVerification ? "Verify Email" : "Sign Up"}
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

export default SignupVerificationPage
