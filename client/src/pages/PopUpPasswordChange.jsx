import { useNavigate } from "react-router-dom"

const PasswordSuccessPage = () => {
  const navigate = useNavigate()

  const handleSignInNow = () => {
    navigate('/login')
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
  
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
  
        {/* Main Container */}
        <div className="relative z-10 h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto h-full max-h-[90vh] flex items-center justify-center">
            {/* Success Modal/Popup - Much Larger */}
            <div
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-12 sm:p-16 lg:p-24 shadow-2xl w-full max-w-5xl mx-4 text-center relative overflow-hidden min-h-[70vh]"
              style={{
                background: `linear-gradient(135deg, #5576D9 0%, #4a6bc7 100%)`,
              }}
            >
               
  
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {/* Success Icon/Shield */}
                <div className="mb-12 flex justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
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
                       
                    </div>
                  </div>
                </div>
  
                {/* Success Title */}
                <div className="mb-12">
                  <h1 className="text-xxl sm:text-2xl lg:text-3xl font-bold font-sans text-white mb-6">
                    Password Updated!
                  </h1>
                  <p className="text-md sm:text-xl lg:text-2xl text-white font-md font-sans max-w-2xl mx-auto leading-relaxed">
                    Please Sign In to your email account again
                  </p>
                </div>
  
                {/* Sign In Button */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleSignInNow}
                    className="bg-white text-blue-600 font-medium font-sans py-2 px-12 sm:px-16 lg:px-20 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-xl sm:text-md"
                    style={{
                      color: "#5576D9",
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