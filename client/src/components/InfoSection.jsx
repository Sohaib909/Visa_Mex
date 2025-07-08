import { useLanguage } from '../context/LanguageContext';
import { useFeatures } from '../hooks/useContent';

const InfoSection = () => {
  const { t } = useLanguage();
  const { features, loading, error } = useFeatures();
  
  // Fallback features from translations if no dynamic content
  const fallbackFeatures = [
    {
      icon: "/icon1.png",
      title: t("info.feature1Title"),
      description: t("info.feature1Desc")
    },
    {
      icon: "/icon2.png", 
      title: t("info.feature2Title"),
      description: t("info.feature2Desc")
    },
    {
      icon: "/icon3.png",
      title: t("info.feature3Title"), 
      description: t("info.feature3Desc")
    },
    {
      icon: "/icon4.png",
      title: t("info.feature4Title"),
      description: t("info.feature4Desc")
    },
    {
      icon: "/icon1.png", // Reusing icon1 for the 5th feature
      title: t("info.feature5Title"),
      description: t("info.feature5Desc")
    }
  ];

  // Use dynamic content if available, otherwise fallback to translations
  const displayFeatures = features.length > 0 ? features.map(feature => ({
    ...feature,
    icon: feature.iconUrl || "/icon1.png" // Fallback icon
  })) : fallbackFeatures;

  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded mb-4 mx-auto w-32"></div>
              <div className="h-8 bg-gray-300 rounded mb-4 mx-auto w-64"></div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center group bg-white rounded-lg shadow-md p-3 sm:p-4 animate-pulse"
                style={{ minWidth: '160px', minHeight: '150px' }}
              >
                <div className="mb-3 sm:mb-4">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-300"
                  ></div>
                </div>
                <div className="h-4 bg-gray-300 rounded mb-1 sm:mb-2 w-20"></div>
                <div className="h-12 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Features loading error:', error);
    // Continue with fallback content
  }

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md mb-4" style={{ backgroundColor: "rgba(85, 118, 217, 0.2)" }}>
            <p className="text-blue-600 text-xl font-sm tracking-wide">{t("labels.allFaculties")}</p>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276] mb-4">{t("info.title")}</h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
          {displayFeatures.map((feature, index) => (
            <div 
              key={feature.id || index} 
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
                    onError={(e) => {
                      e.target.src = "/icon1.png"; // Fallback to default icon
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-xl font-bold text-[#1B3276] mb-1 sm:mb-2 leading-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-black text-lg font-md leading-relaxed">
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