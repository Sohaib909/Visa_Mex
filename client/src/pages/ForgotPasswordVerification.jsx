import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useApi from "../hooks/useApi"

const ForgotPasswordVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  
  const navigate = useNavigate()
  const location = useLocation()
  const { authApi } = useApi()

  // Get email from navigation state
  useEffect(() => {
    const emailFromState = location.state?.email
    if (emailFromState) {
      setEmail(emailFromState)
    } else {
      // If no email provided, redirect back to forgot password
      navigate('/forgot-password')
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
              {/* Left Side - Verification Form (40%) */}
              <div
                className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.57)",
                  backdropFilter: "blur(10.1px)",
                }}
              >
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  {/* Verification Title */}
                  <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl text-left pl-8 font-semibold font-sans mb-8" style={{ color: "#1B3276" }}>
                      Verification
                    </h1>
                    <p className="text-gray-600 text-base font-sans font-sm pl-8">
                      Enter the 4-digit code sent to {email}
                    </p>
                  </div>

                  {/* Verification Form */}
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Verification Code Inputs */}
                    <div className="flex justify-left pl-6 space-x-6">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          disabled={isSubmitting}
                          className="w-14 h-14 text-center text-xl font-semibold bg-white/90 border border-blue-800 rounded-full text-gray-700 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            focusRingColor: "#5576D9",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          }}
                          onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                          onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                          maxLength={1}
                        />
                      ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200 mx-8">
                        {error}
                      </div>
                    )}

                    {/* Resend Code Text */}
                    <div className="text-left pl-8">
                      <p className="text-gray-700 font-sm font-sans">
                        If you didn't receive a code,{" "}
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={isSubmitting}
                          className="hover:opacity-80 font-semibold font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: "#5576D9" }}
                        >
                          Resend
                        </button>
                      </p>
                    </div>

                    {/* Verify Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-white font-semibold font-sans py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: "#5576D9",
                        }}
                        onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = "#4a6bc7")}
                        onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = "#5576D9")}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

                <div className="relative mb-24 z-10 text-center">
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

export default ForgotPasswordVerificationPage
