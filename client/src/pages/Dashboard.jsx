import AuthNavbar from '../components/AuthNavbar';
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import HowItWorksSection from "../components/HowItWorksSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();



  return (
    <div className="min-h-screen w-full font-['Montserrat']" style={{ backgroundColor: "#F7F9FD" }}>
      <AuthNavbar />
      
      <HeroSection />
      <InfoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Dashboard; 