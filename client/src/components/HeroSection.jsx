import { useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { useLanguage } from "../context/LanguageContext"

const HeroSection = () => {
  const { t } = useLanguage()
  const [selectedCountry, setSelectedCountry] = useState(t("countries.australia"))
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

  const countries = [
    t("countries.australia"),
    t("countries.unitedStates"), 
    t("countries.canada"),
    t("countries.unitedKingdom"),
    t("countries.germany"),
    t("countries.france")
  ]

  return (
    <main 
      className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16 relative overflow-hidden bg-gray-200"
    >
      {/* Gradient Images - Enhanced and more prominent */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="/Aboutgradient1.png" 
          alt="" 
          className="absolute -bottom-10 -right-10 w-[32rem] h-[32rem] lg:w-[40rem] lg:h-[40rem] xl:w-[48rem] xl:h-[48rem] object-contain transform rotate-270 opacity-80"
        />
        <img 
          src="/Aboutgradient2.png" 
          alt="" 
          className="absolute top-0 left-0 w-full h-full lg:w-1/2 object-cover opacity-60"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 xl:gap-20 items-center relative">
          {/* Left Side - Content */}
          <div className="space-y-6 sm:space-y-8 relative order-2 lg:order-1 bg-blue-50/40 rounded-2xl p-6 sm:p-8 lg:p-10">
            {/* Main Hero Text */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[65px] font-extrabold leading-[130%] tracking-[0%] relative z-10 pt-4 sm:pt-6 lg:pt-8 px-2 sm:px-4 lg:px-6"
              style={{
                fontWeight: 800,
                color: "#1B3276",
                lineHeight: "130%",
              }}
            >
{t("hero.title")}
            </h1>
          </div>

          {/* Right Side - Hero Image */}
          <div className="flex justify-center lg:justify-end relative order-1 lg:order-2">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl relative z-10 p-2 mt-4 sm:mt-6 lg:mt-12 lg:ml-8 lg:mr-4">
              <img
                src="/banner1.png"
                alt="Travel destinations with suitcase showing landmarks like Eiffel Tower, Big Ben, and Statue of Liberty"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Fallback placeholder
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "flex"
                }}
              />
              {/* Fallback placeholder */}
              <div
                className="w-full aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center hidden"
                style={{ display: "none" }}
              >
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm">Hero Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Container with Subtitle, Country Selector and CTA Button - Positioned to span across both columns */}
          <div className="lg:col-span-2 relative z-20 -mt-16 sm:-mt-20 lg:-mt-32 xl:-mt-40 order-3">
            <div
              className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/10 max-w-full sm:max-w-4xl lg:max-w-5xl ml-0 lg:ml-8 mx-auto lg:mx-0"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-x-8 xl:space-x-12 space-y-4 sm:space-y-6 lg:space-y-0">
                {/* Subtitle */}
                <div className="flex-1 lg:flex-none lg:max-w-lg">
                  <p className="text-base sm:text-lg lg:font-md text-blue-900 leading-relaxed lg:whitespace-nowrap ">
                    {t("hero.subtitle")}
                  </p>
                </div>

                {/* Country Selector and CTA Button Container */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4 justify-start">
                  {/* Country Selector */}
                  <div className="relative w-full sm:w-auto">
                    <label className="block text-xs sm:text-sm font-sm mb-1 sm:mb-2" style={{ color: "#31474D" }}>{t("hero.country")}</label>
                    <button
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="flex items-center justify-between w-full sm:w-28 lg:w-32 px-2 sm:px-3 py-2 sm:py-2.5 transition-colors"
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="w-4 h-3 sm:w-5 sm:h-4 relative overflow-hidden rounded-sm">
                          {/* Australia Flag */}
                          <div className="absolute inset-0 bg-blue-800"></div>
                          <div className="absolute top-0 left-0 w-3 h-2">
                            <div className="absolute inset-0 bg-blue-800"></div>
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-600"></div>
                            <div className="absolute top-0 left-0 h-full w-0.5 bg-red-600"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-red-600 transform rotate-45 origin-top-left scale-x-[0.1]"></div>
                            <div className="absolute top-0 right-0 w-full h-full bg-red-600 transform -rotate-45 origin-top-right scale-x-[0.1]"></div>
                          </div>
                        </div>
                        <span className="text-gray-700 font-medium text-xs sm:text-sm">{selectedCountry}</span>
                      </div>
                      <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border py-1 z-10">
                        {countries.map((country) => (
                          <button
                            key={country}
                            onClick={() => {
                              setSelectedCountry(country)
                              setIsCountryDropdownOpen(false)
                            }}
                            className="block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Start Your Application Button */}
                  <div className="w-full sm:w-auto sm:mt-4 lg:mt-6">
                    <button
                      className="w-full sm:w-auto text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shadow-md whitespace-nowrap"
                      style={{
                        backgroundColor: "#5576D9",
                        width: "100%",
                        minWidth: "140px",
                        height: "40px",
                        minHeight: "40px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    >
{t("hero.startApplication")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HeroSection 