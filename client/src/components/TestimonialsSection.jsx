import { useLanguage } from '../context/LanguageContext';
import { useTestimonials } from '../hooks/useContent';

const TestimonialsSection = () => {
  const { t } = useLanguage();
  const { testimonials, loading, error } = useTestimonials();
  
  // Fallback testimonials from translations if no dynamic content
  const fallbackTestimonials = [
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial")
    },
    {
      name: "Noah Jack", 
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial2")
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png", 
      rating: 5,
      text: t("testimonials.clientTestimonial")
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5, 
      text: t("testimonials.clientTestimonial3")
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial4")
    },
    {
      name: "Gabrile Jackson",
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial5")
    },
    {
      name: "Ashley Cooper", 
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial6")
    },
    {
      name: "William Leo",
      image: "/Pic.png",
      rating: 5,
      text: t("testimonials.clientTestimonial7")
    }
  ];

  // Use dynamic content if available, otherwise fallback to translations
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  if (loading) {
    return (
      <section className="w-full py-12 sm:py-16 bg-gray-50 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4 mx-auto w-48"></div>
              <div className="h-12 bg-gray-300 rounded mb-8 mx-auto w-96"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md animate-pulse">
                  <div className="h-16 bg-gray-300 rounded mb-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Testimonials loading error:', error);
    // Continue with fallback content
  }

  return (
    <section className="w-full py-12 sm:py-16 bg-gray-50 relative overflow-hidden">
      {/* Gradient Images - Repositioned with bigger size */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="/Aboutgradient1.png" 
          alt="" 
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
        />
        <img 
          src="/Aboutgradient2.png" 
          alt="" 
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
        />
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Pill-shaped label */}
          <div className="inline-block mb-3 px-4 py-1 rounded-lg bg-blue-100">
            <span className="text-blue-800 text-lg font-sm">{t("labels.testimonials")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276]">{t("testimonials.title")}</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <div key={testimonial.id || index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                {testimonial.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-3">
                {/* Profile Picture */}
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none"
                    e.target.nextSibling.style.display = "flex"
                  }}
                />
                {/* Fallback placeholder */}
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center hidden"
                  style={{ display: "none" }}
                >
                  <span className="text-white text-xs font-medium">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                {/* Name and Rating */}
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1B3276] text-lg">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-start ">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection 