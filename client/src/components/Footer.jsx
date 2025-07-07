const Footer = () => {
  return (
    <footer className="w-full relative mb-0">
      {/* Blue CTA Card - Overlapping into footer */}
      <div className="relative z-10 -mb-8 sm:-mb-10 lg:-mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div 
            className="rounded-2xl px-8 py-6 text-center text-white shadow-xl"
            style={{
              background: 'linear-gradient(to right, #294DB6, #5576D9)'
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Loream Ipsum Is Dummy Text For Use Dummy</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              We help international students find the best study courses and change their lives.
            </p>
            <button className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Start Your Application
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content - Overlapped by blue card */}
      <div className="bg-gray-50 py-2 pt-4 sm:pt-6 lg:pt-14 pb-0 relative z-0">
        <div className="w-full">
          <div className="bg-white border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-3xl p-6 sm:p-8 lg:p-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                {/* About Maxvisa */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-[#1B3276] text-lg mb-4">About Maxvisa</h4>
                  <p className="text-gray-800 text-sm leading-relaxed">
                  Maxvisa is the single systematic solution for international students to first choose a study course and then continue until they get what they desire.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-gray-800 text-lg mb-4">Quick Links</h4>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-blue-500 text-sm hover:text-[#294DB6] transition-colors underline decoration-blue-500">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-500 text-sm hover:text-[#294DB6] transition-colors underline decoration-blue-500">
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-[#1B3276] text-lg mb-4">Contact</h4>
                  <div className="space-y-4 text-sm text-gray-800 relative">
                    {/* Blue connecting line */}
                                         <div className="absolute left-3 top-3 bottom-3 w-px bg-blue-300 rounded-full"></div>
                    
                    {/* Address */}
                    <div className="flex items-start space-x-3 relative z-10">
                      <div className="border border-[#5576D9] rounded-lg flex-shrink-0 mt-1 bg-white">
                        <img src="/FC-1.png" alt="Address Icon" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <p>Waterman Business Centre, Suite 371,</p>
                        <p>44 Lakeview Drive, Scoresby,</p>
                        <p>VIC 3179, Australia</p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="border border-[#5576D9] rounded-lg flex-shrink-0 bg-white">
                        <img src="/FC-2.png" alt="Email Icon" className="w-6 h-6 object-contain" />
                      </div>
                      <p>info@maxvisaapply.com</p>
                    </div>
                    
                    {/* Phone */}
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="border border-[#5576D9] rounded-lg flex-shrink-0 bg-white">
                        <img src="/FC-3.png" alt="Phone Icon" className="w-6 h-6 object-contain" />
                      </div>
                      <p>+61 45 743 84 88</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copyright */}
             
            </div>
            
          </div>
          <div className="w-full bg-blue-100" >
          <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 flex items-start justify-start">
                <p className="text-gray-700 text-md  font-normal py-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
                Copyright © 2024 maxvisa.com All rights reserved.
                </p>
          </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 