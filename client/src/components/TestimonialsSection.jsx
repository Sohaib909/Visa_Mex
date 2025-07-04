const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa processing service within the timeline as they requested. In the end, the client found a 50% increase in efficiency with their visa application process since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable."
    },
    {
      name: "Noah Jack", 
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa service with excellent timeline as they requested. In the end, the client found a 50% increase in processing speed with their visa applications since its launch."
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png", 
      rating: 5,
      testimonial: "Teamollo delivered the visa processing service within the timeline as they requested. In the end, the client found a 50% increase in efficiency with visa applications since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable."
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5, 
      testimonial: "Teamollo delivered the visa service within the timeline as they requested. In the end, the client found a 50% increase in application processing speed with their visa services since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable."
    },
    {
      name: "Ashley Cooper",
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa processing service within the timeline as they requested. In the end, the client found a 50% increase in efficiency with visa applications since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable. Teamollo delivered the visa service within the timeline as they requested. In the end, the client found a 50% increase in processing speed with their applications since its launch."
    },
    {
      name: "Gabrile Jackson",
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa service within the timeline as they requested. In the end, the client found a 50% increase in processing efficiency with visa applications since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable."
    },
    {
      name: "Ashley Cooper", 
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa processing service within the timeline as they requested. In the end, the client found a 50% increase in efficiency with their applications since its launch."
    },
    {
      name: "William Leo",
      image: "/Pic.png",
      rating: 5,
      testimonial: "Teamollo delivered the visa service within the timeline as they requested. In the end, the client found a 50% increase in processing speed with visa applications since its launch. They also had an impressive ability to use technologies that the company hasn't used, which have also proved to be easy to use and reliable."
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276] mb-4">What Our Customers Say</h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                {testimonial.testimonial}
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
                  <h4 className="font-semibold text-[#1B3276] text-sm">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center space-x-1">
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