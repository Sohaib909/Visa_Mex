import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useApi from "../hooks/useApi"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const navigate = useNavigate()
  const { authApi } = useApi()

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
    <div className="w-full relative overflow-hidden font-['Montserrat']">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image.jpg')`,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 h-screen flex items-center justify-center custom-height-vh">
        <div className="w-full custom-container mx-auto h-full max-h-[85vh] custom-padding-t-b">
          {/* Card Container */}
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              {/* Left Side - Reset Password Form (40%) */}
              <div
                className="lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center relative"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.57)",
                  backdropFilter: "blur(10.1px)",
                }}
              >
                <div className="relative z-10 w-full max-w-sm mx-auto">
                  {/* Reset Password Title */}
                  <div className="mb-10">
                    <h1 className="text-3xl sm:text-3xl font-semibold font-sans mb-2" style={{ color: "#1B3276" }}>
                      Forgot Password
                    </h1>
                  </div>

                  {/* Reset Password Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-5 py-4 bg-white/90 border border-blue-700 border-[1px] rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          focusRingColor: "#5576D9",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px rgba(85, 118, 217, 0.1)`)}
                        onBlur={(e) => (e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)")}
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-200">
                        {success}
                      </div>
                    )}

                    {/* Instruction Text */}
                    <div className="text-left">
                      <p className="text-gray-800 text-sm font-sans font-sm">Please enter your email address above</p>
                    </div>

                    {/* Send Button */}
                    <div className="pt-4">
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

              {/* Right Side - Brand Section (60%) - MATCHING NEW PASSWORD PAGE */}
              <div
                className="lg:col-span-3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden"
                style={{ backgroundColor: "#5576D9" }}
              >
                {/* Decorative Background Pattern */}
                <div
                  className="absolute bottom-0 w-full h-1/2 bg-contain bg-no-repeat bg-center"
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

export default ForgotPasswordPage
