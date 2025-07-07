import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ChevronDownIcon, UserCircleIcon, UserIcon, ClockIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const AuthNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileDropdownRef = useRef(null);

  const languages = [
    { code: "EN", name: t("language.english") },
    { code: "ES", name: t("language.spanish") }
  ];

  // Handle scroll to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Sign out button clicked...');
      setIsProfileDropdownOpen(false); // Close dropdown immediately
      
      const result = await logout();
      console.log('Logout result:', result);
      
      if (result.success) {
        console.log('Logout successful, navigating to home...');
        navigate("/", { replace: true });
      } else {
        console.error('Logout failed:', result);
        // Force navigation even if logout reports failure
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if there's an error
      navigate("/", { replace: true });
    }
  };

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
  };

  const navItems = [
    { name: t("nav.aboutUs"), href: "/about" },
    { name: t("nav.travelRequirements"), href: "/travel-requirements" },
    { name: t("nav.myApplications"), href: "/my-applications" },
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <header className={`w-full px-4 sm:px-6 lg:px-8 py-6 shadow-sm transition-all duration-300 ${
      isScrolled ? 'sticky top-0 z-50 bg-white' : 'relative bg-gray-200'
    }`}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/MEXVISA.svg"
              alt="MEXVISA Logo"
              className="h-[32px] w-[100px] object-contain"
            />
          </button>
        </div>

        {/* Desktop Menu - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-8">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`transition-colors border-b-2 pb-1 ${
                    isActive 
                      ? 'text-blue-900 font-bold border-blue-900' 
                      : 'text-blue-900 hover:text-blue-900 font-normal border-transparent hover:border-blue-900'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg  transition-colors"
            >
              {renderFlag(currentLanguage)}
              <span className="text-blue-900 font-medium">{currentLanguage}</span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-gray-50 text-blue-900"
                  >
                    {renderFlag(lang.code)}
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative " ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-80 transition-colors"
              style={{ backgroundColor: "#587E89" }}
            >
              <img 
                src="/profile2.svg" 
                alt="Profile" 
                className="w-[25px] h-[25px] object-contain"
              />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border py-2 z-50 min-w-[280px] pointer-events-auto">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {user?.firstName || user?.name || "Omid Ha"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.email || "omidha1997@gmail.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors pointer-events-auto"
                  >
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t("nav.profile")}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate("/history");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors pointer-events-auto"
                  >
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t("nav.history")}</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors pointer-events-auto cursor-pointer"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">{t("nav.signOut")}</span>
                  </button>
                </div>
              </div>
            )}
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
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation Links */}
            <div className="pb-4 border-b border-gray-200">
              <nav className="space-y-3">
                {navItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 transition-colors rounded-lg border-l-4 ${
                        isActive 
                          ? 'text-blue-900 font-bold border-blue-900 bg-blue-50' 
                          : 'text-blue-900 hover:text-blue-600 font-normal border-transparent hover:bg-blue-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Language Selector */}
            <div className="pb-4 border-b border-gray-200">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {renderFlag(currentLanguage)}
                  <span className="text-blue-900 font-medium">{currentLanguage}</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 ml-auto" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="mt-2 bg-gray-50 rounded-lg py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-900"
                      >
                        {renderFlag(lang.code)}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Profile Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user?.firstName || user?.name || "Omid Ha"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.email || "omidha1997@gmail.com"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors rounded-lg"
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{t("nav.profile")}</span>
                </button>
                
                <button
                  onClick={() => {
                    navigate("/history");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors rounded-lg"
                >
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{t("nav.history")}</span>
                </button>
                
                <button
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleLogout(e);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors rounded-lg"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{t("nav.signOut")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthNavbar; 