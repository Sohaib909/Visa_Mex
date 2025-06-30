import { useNavigate } from "react-router-dom"
import useAuthLayout from "../hooks/useAuthLayout"

const PasswordSuccessPage = () => {
  const navigate = useNavigate()

  // Get centralized layout configuration
  const { container, typography, components, colors } = useAuthLayout()

  const handleSignInNow = () => {
    navigate('/login', { 
      state: { 
        fromPasswordReset: true
      } 
    })
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Container */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center ${container.padding}`}>
        <div className="w-full max-w-5xl sm:max-w-6xl lg:max-w-7xl mx-auto min-h-[70vh] flex items-center justify-center">
          {/* Success Modal/Popup - Responsive Size */}
          <div
            className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 xl:p-24 shadow-2xl w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl mx-4 text-center relative overflow-hidden min-h-[60vh] sm:min-h-[70vh]"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            }}
          >
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Success Icon/Shield */}
              <div className="mb-8 sm:mb-10 lg:mb-12 flex justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48">
                  <img
                    src="/success.png"
                    alt="Success"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  {/* Fallback Shield Icon */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    {/* Could add SVG icon here if needed */}
                  </div>
                </div>
              </div>

              {/* Success Title */}
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <h1 className={`${typography.title} sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-sans text-white mb-4 sm:mb-6`}>
                  Password Updated!
                </h1>
                <p className={`${typography.instruction} sm:text-lg lg:text-xl xl:text-2xl text-white font-medium font-sans max-w-2xl mx-auto leading-relaxed`}>
                  Please Sign In to your email account again
                </p>
              </div>

              {/* Sign In Button */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleSignInNow}
                  className={`bg-white font-medium font-sans py-3 sm:py-4 px-8 sm:px-12 lg:px-16 xl:px-20 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${typography.instruction} sm:text-base lg:text-lg`}
                  style={{
                    color: colors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f8fafc"
                    e.target.style.transform = "scale(1.02)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white"
                    e.target.style.transform = "scale(1)"
                  }}
                >
                  Sign In Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordSuccessPage