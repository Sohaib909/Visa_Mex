import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useApi from "../hooks/useApi"

const SignupVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""])
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { authApi, loading, error } = useApi()
  
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
      const response = await authApi.verifyEmail({
        email: email,
        verificationCode: code
      })

      if (response.success) {
        // Navigate to login page or home page after successful verification
        navigate("/login", { 
          state: { 
            message: "Email verified successfully! You can now login.",
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
      }
    }
  }

  const handleResend = async () => {
    try {
      const response = await authApi.resendVerificationCode(email)
      
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
                    <p className="text-gray-600 text-base font-sans font-sm pl-8">Enter Verification Code</p>
                    <p className="text-gray-500 text-sm font-sans pl-8 mt-2">
                      We sent a 4-digit code to <span className="font-semibold">{email}</span>
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Verification Form */}
                  <form className="space-y-8" onSubmit={handleSignUp}>
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
                          className={`w-14 h-14 text-center text-xl font-semibold font-sans bg-white/90 border rounded-full text-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 shadow-sm ${
                            errors.verificationCode ? 'border-red-500' : 'border-blue-800'
                          }`}
                          style={{
                            focusRingColor: "#5576D9",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          }}
                          onFocus={(e) => !errors.verificationCode && (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                          onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                          maxLength={1}
                          disabled={loading}
                        />
                      ))}
                    </div>

                    {/* Error Message for verification code */}
                    {errors.verificationCode && (
                      <div className="text-left pl-8">
                        <p className="text-red-600 text-sm">{errors.verificationCode}</p>
                      </div>
                    )}

                    {/* Resend Code Text */}
                    <div className="text-left pl-8">
                      <p className="text-gray-700 text-sm">
                        If you didn't receive a code,{" "}
                        <button
                          type="button"
                          className="hover:opacity-80 font-semibold transition-colors disabled:opacity-50"
                          style={{ color: "#5576D9" }}
                          onClick={handleResend}
                          disabled={loading}
                        >
                          Resend
                        </button>
                      </p>
                    </div>

                    {/* Sign Up Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: "#5576D9",
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#4a6bc7")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#5576D9")}
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : needsVerification ? "Verify Email" : "Sign Up"}
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
                      MEX<span className="font-light">VISA</span>
                    </h1>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-2">
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

export default SignupVerificationPage
