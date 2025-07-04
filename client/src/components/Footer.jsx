const Footer = () => {
  return (
    <footer className="w-full relative">
      {/* Blue CTA Card - Overlapping into footer */}
      <div className="relative z-10 -mb-8 sm:-mb-10 lg:-mb-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl px-8 py-6 text-center text-white shadow-xl">
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
              <div className="flex flex-col items-start space-y-6 text-sm text-gray-600">
                {/* Address */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-3">
                    <div className="border border-[#5576D9] rounded-lg p-1 mb-1 bg-white">
                      <img src="/FC-1.png" alt="Address Icon" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex-1 w-px bg-[#5576D9] h-8"></div>
                  </div>
                  <div>
                    <p>Waterman Business Centre, Suite 371,</p>
                    <p>44 Lakeview Drive, Scoresby,</p>
                    <p>VIC 3179, Australia</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-3">
                    <div className="border border-[#5576D9] rounded-lg p-1 mb-1 bg-white">
                      <img src="/FC-2.png" alt="Email Icon" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="flex-1 w-px bg-[#5576D9] h-8"></div>
                  </div>
                  <div>
                    <p>info@maxvisaapply.com</p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-3">
                    <div className="border border-[#5576D9] rounded-lg p-1 bg-white">
                      <img src="/FC-3.png" alt="Phone Icon" className="w-5 h-5 object-contain" />
                    </div>
                  </div>
                  <div>
                    <p>+61 45 743 84 88</p>
                  </div>
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