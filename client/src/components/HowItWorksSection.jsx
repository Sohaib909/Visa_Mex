import { useLanguage } from '../context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "01",
      title: t("howItWorks.stepAlt1Title"),
      description: t("howItWorks.stepAlt1Desc")
    },
    {
      number: "02", 
      title: t("howItWorks.stepAlt2Title"),
      description: t("howItWorks.stepAlt2Desc")
    },
    {
      number: "03",
      title: t("howItWorks.stepAlt3Title"),
      description: t("howItWorks.stepAlt3Desc")
    },
    {
      number: "04",
      title: t("howItWorks.stepAlt4Title"),
      description: t("howItWorks.stepAlt4Desc")
    }
  ]

  return (
    <section 
      className="w-full py-12 sm:py-16 relative overflow-hidden"
      style={{ backgroundColor: "#F7F9FD" }}
    >
      {/* Gradient Images - Diagonal positioning (bottom-left and top-right) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="/Aboutgradient1.png" 
          alt="" 
          className="absolute -bottom-32 -left-42 w-[42rem] h-[32rem] object-contain transform rotate-180"
        />
        <img 
          src="/Aboutgradient2.png" 
          alt="" 
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] object-contain transform rotate-270"
        />
      </div>
      {/* Background Image positioned at parent level */}
      <div className="absolute right-0 top-0 w-[45%] sm:w-[50%] lg:w-[55%] h-full z-10">
        <img
          src="/choose.png"
          alt="How it works - People working on visa applications"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback placeholder
            e.target.style.display = "none"
            e.target.nextSibling.style.display = "flex"
          }}
        />
        {/* Fallback placeholder */}
        <div
          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hidden"
          style={{ display: "none" }}
        >
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm">How It Works Image</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-20">
        {/* Header */}
        <div className="text-left mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-md mb-4" style={{ backgroundColor: "rgba(85, 118, 217, 0.2)" }}>
            <p className="text-lg font-sm tracking-wide" style={{ color: "#294DB6" }}>{t("labels.allFaculties")}</p>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276]">{t("howItWorks.title")}</h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 xl:gap-16 items-stretch">
          {/* Left Side - Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-1">
            {steps.map((step, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                {/* Step Number - Square */}
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-md flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#5576D9" }}
                >
                  {step.number}
                </div>
                
                {/* Step Content */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1B3276] mb-1 sm:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Empty space for image */}
          <div className="w-full h-full hidden lg:block">
            {/* Content space - image is now at parent level */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection 