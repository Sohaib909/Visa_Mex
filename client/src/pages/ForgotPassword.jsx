import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useApi from "../hooks/useApi"
import useAuthLayout from "../hooks/useAuthLayout"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const navigate = useNavigate()
  const { authApi } = useApi()
  
  // Get centralized layout configuration
  const { container, grid, form, brand, typography, components, colors } = useAuthLayout()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authApi.forgotPassword(email)
      
      if (response.success) {
        setSuccess("Reset code sent to your email!")
        // Navigate to forgot password verification page with email
        setTimeout(() => {
          navigate('/forgot-password-verification', { state: { email } })
        }, 1500)
      }
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.")
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

            {/* Left Side - Reset Password Form (40%) - SECOND ON MOBILE */}
            <div
              className={`${grid.formSection} ${form.containerClasses} ${form.padding}`}
              style={{
                backgroundColor: form.background,
                backdropFilter: form.backdropFilter,
              }}
            >
              <div className={form.contentWrapper}>
                {/* Reset Password Title */}
                <div className={form.titleMargin}>
                  <h1 className={typography.title} style={{ color: colors.title }}>
                    Forgot Password
                  </h1>
                </div>

                {/* Reset Password Form */}
                <form className={form.formClasses} onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className={components.input.classes}
                      style={components.input.focusStyle}
                      onFocus={(e) => (e.target.style.boxShadow = components.input.focusBoxShadow)}
                      onBlur={(e) => (e.target.style.boxShadow = components.input.blurBoxShadow)}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className={components.message.error}>
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className={components.message.success}>
                      {success}
                    </div>
                  )}

                  {/* Instruction Text */}
                  <div className="text-left">
                    <p className={`text-gray-800 ${typography.instruction}`}>Please enter your email address above</p>
                  </div>

                  {/* Send Button */}
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
                          Sending...
                        </div>
                      ) : (
                        "Send"
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

export default ForgotPasswordPage
