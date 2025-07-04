const Footer = () => {
  return (
    <footer className="w-full relative">
      {/* Blue CTA Card - Overlapping into footer */}
      <div className="relative z-10 -mb-8 sm:-mb-10 lg:-mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 py-12 text-center text-white shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Loream Ipsum Is Dummy Text For Use Dummy</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              We help international students find the best study courses and change their lives.
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Start Your Application
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content - Overlapped by blue card */}
      <div className="bg-gray-50 py-8 sm:py-10 lg:py-12 pt-12 sm:pt-14 lg:pt-16 relative z-0">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* About Maxvisa */}
            <div>
              <h4 className="font-semibold text-[#1B3276] text-base sm:text-lg mb-3 sm:mb-4">About Maxvisa</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Maxvisa is a trusted visa service provider helping thousands of applicants achieve their travel dreams with professional guidance and support.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-[#1B3276] text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-500 text-sm hover:text-[#294DB6] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-500 text-sm hover:text-[#294DB6] transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-[#1B3276] text-base sm:text-lg mb-3 sm:mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 text-[#5576D9]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>Level 13, 200 Queen Street</p>
                    <p>Melbourne, VIC 3000, Australia</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#5576D9]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p>info@maxvisa.com</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#5576D9]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p>+61 3 9041 1188</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Maxvisa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 