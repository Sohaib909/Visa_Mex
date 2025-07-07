import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useLanguage } from "../context/LanguageContext"

const Navbar = () => {
  const navigate = useNavigate()
  const { currentLanguage, changeLanguage, t } = useLanguage()
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const languages = [
    { code: "EN", name: t("language.english") },
    { code: "ES", name: t("language.spanish") }
  ]

  // Handle scroll to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignInClick = () => {
    navigate("/login")
  }

  const handleSignUpClick = () => {
    navigate("/register")
  }

  const renderFlag = (langCode) => {
    if (langCode === "EN") {
      return (
        <div className="w-6 h-6 relative overflow-hidden rounded-full">
          <img 
            src="/english.png" 
            alt="English Flag" 
            className="w-full h-full object-cover"
          />
        </div>
      )
    } else if (langCode === "ES") {
      return (
        <div className="w-6 h-6 relative overflow-hidden rounded-full">
          <img 
            src="/maxican.jpg" 
            alt="Mexican Flag" 
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    return null
  }

  return (
    <header className={`w-full px-4 sm:px-6 lg:px-8 py-6 shadow-sm transition-all duration-300 ${
      isScrolled ? 'sticky top-0 z-50 bg-white' : 'relative bg-gray-200'
    }`}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex  object-contain items-center focus-within:sr-only">
          <img
            src="/MEXVISA.svg"
            alt="MEXVISA Logo"
            className="h-[32px] w-[100px] object-contain"
          />
        </div>

        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              {renderFlag(currentLanguage)}
              <span className="text-gray-700 font-medium">{currentLanguage}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border py-1 z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code)
                      setIsLanguageDropdownOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    {renderFlag(lang.code)}
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleSignInClick}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              {t("nav.signIn")}
            </button>
            <button
              onClick={handleSignUpClick}
              className="px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#5576D9" }}
            >
              {t("nav.signUp")}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Menu Button - Shown only on mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 transition-colors border-2 border-[#5576D9] bg-white shadow-sm"
            type="button"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <>
                <XMarkIcon className="w-6 h-6 text-[#5576D9] stroke-2" />
                <span className="text-[#5576D9] font-medium text-sm">{t("nav.close")}</span>
              </>
            ) : (
              <>
                <Bars3Icon className="w-6 h-6 text-[#5576D9] stroke-2" />
                <span className="text-[#5576D9] font-medium text-sm">{t("nav.menu")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Language Selector */}
            <div className="pb-4 border-b border-gray-200">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {renderFlag(currentLanguage)}
                  <span className="text-gray-700 font-medium">{currentLanguage}</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 ml-auto" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="mt-2 bg-gray-50 rounded-lg py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code)
                          setIsLanguageDropdownOpen(false)
                        }}
                        className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        {renderFlag(lang.code)}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => {
                  handleSignInClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors border border-gray-300 rounded-lg"
              >
                {t("nav.signIn")}
              </button>
              <button
                onClick={() => {
                  handleSignUpClick()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#5576D9" }}
              >
                {t("nav.signUp")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar 