import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import AuthNavbar from '../components/AuthNavbar';
import VisaSections from "../components/visa-section";
import FAQSection from "../components/faq-section";
import Footer from "../components/Footer";

const AboutUs = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full font-['Montserrat']" style={{ backgroundColor: "#F7F9FD" }}>
      {/* Conditional Navbar based on authentication */}
      {isAuthenticated ? <AuthNavbar /> : <Navbar />}
      
      <div className="">
        {/* Enhanced About Us Hero Section with Gradient Images - Same effect as Home/Dashboard */}
        <div 
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, #e5e7eb 0%, #e5e7eb 60%, rgba(229, 231, 235, 0.8) 80%, rgba(229, 231, 235, 0.4) 90%, transparent 100%)"
          }}
        >
          {/* Gradient Images - Same positioning as HeroSection */}
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
          
          <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            {/* Content with blue semi-transparent background - Same as HeroSection */}
            <div className="text-center mb-20 bg-blue-50/40 rounded-2xl p-6 sm:p-8 lg:p-10 mx-auto max-w-6xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                 <span style={{ color: "#1B3276" }}>{t("about.title")}</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-10 leading-relaxed" style={{ color: '#101E46' }}>
                {t("about.description")}
              </p>
              {/* Glassmorphism card effect for button */}
              <div className="   inline-block">
                <button className="bg-blue-800 hover:bg-[#294DB6] text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                  {t("about.startApplication")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("about.missionTitle")}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("about.missionText")}
              </p>
            </div>
            <div>
              <img 
                src="/About2.png" 
                alt="About MEXVISA - Our Mission" 
                className="w-full h-auto "
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f3f4f6'/%3E%3Ctext x='300' y='200' font-family='Arial' font-size='18' fill='%236b7280' text-anchor='middle'%3EAbout2.png%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>

        <VisaSections />
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
