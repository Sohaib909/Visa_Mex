import { useLanguage } from '../context/LanguageContext';

const InfoSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: "/icon1.png",
      title: "Live Support 24/7",
      description: "Chat or video call with our experts anytime."
    },
    {
      icon: "/icon2.png", 
      title: "Simplified Process",
      description: "Automated form filling from your passport."
    },
    {
      icon: "/icon3.png",
      title: "Secure Document", 
      description: "Upload and store your documents securely."
    },
    {
      icon: "/icon4.png",
      title: "Track Your Visa",
      description: "Know every step of your application process."
    },
    {
      icon: "/icon1.png", // Reusing icon1 for the 5th feature
      title: "Flexible Pricing",
      description: "Special plans for travel agencies."
    }
  ]

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: "rgba(85, 118, 217, 0.2)" }}>
            <p className="text-[#3B5998] text-xs font-medium tracking-wide">All Faculties</p>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276] mb-4">{t("info.title")}</h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 sm:p-4"
              style={{ minWidth: '160px', minHeight: '150px' }}
            >
              {/* Icon Container */}
              <div className="mb-3 sm:mb-4 transform transition-transform duration-300 group-hover:scale-105">
                <div 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(85, 118, 217, 0.2)" }}
                >
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm font-semibold text-[#1B3276] mb-1 sm:mb-2 leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InfoSection 