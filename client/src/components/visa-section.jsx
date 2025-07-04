import { Eye, MessageCircle, Shield, MapPin, DollarSign } from 'lucide-react';
import FadeEffect from './fade-effect';

export default function VisaSections() {
  const features = [
    {
      icon: Eye,
      title: 'Simplified Visa Applications',
      description:
        'Automated form filling using your passport details to save time and reduce errors.',
    },
    {
      icon: MessageCircle,
      title: 'Live Support',
      description:
        '24/7 chat and video call support to guide you at every step.',
    },
    {
      icon: Shield,
      title: 'Secure Document Management',
      description:
        'Upload, store, and manage your documents with complete security.',
    },
    {
      icon: MapPin,
      title: 'Visa Tracking',
      description:
        'Stay informed about your application status and progress in real-time.',
    },
    {
      icon: DollarSign,
      title: 'Flexible Pricing Plans',
      description:
        'Tailored solutions for individual travelers and travel agencies.',
    },
  ];

  return (
    <div className="w-full">
      {/* Our Mission Section */}
      {/* <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-[36px] font-bold text-[#101E46]">
                Our Mission
              </h2>

              <div className="space-y-4 leading-relaxed text-[22px] text-[#101E46]">
                <p>
                  We aim to make international travel accessible by simplifying
                  the complex visa process. With cutting-edge technology, live
                  support, and a user-friendly platform, we empower our clients
                  to focus on their travel plans while we handle the paperwork.
                </p>

                <p>
                  Our commitment to transparency and efficiency ensures that
                  you're always informed about the progress of your application.
                  By leveraging secure document management and automated data
                  extraction, we minimize errors and save you valuable time.
                </p>

                <p className="font-medium text-[#101E46]">
                  Traveling has never been this easy!
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-400 rounded-2xl p-4 transform rotate-3">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Team collaboration meeting"
                  className="rounded-xl object-cover w-full h-80 transform -rotate-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* What We Offer Section */}
      <section className="bg-gray-100 py-16 px-4 relative overflow-hidden">
        {/* Gradient Images - Diagonal positioning (top-left and bottom-right) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img 
            src="/Aboutgradient1.png" 
            alt="" 
            className="absolute -top-20 -left-20 w-96 h-96 object-contain transform rotate-180"
          />
          <img 
            src="/Aboutgradient2.png" 
            alt="" 
            className="absolute -bottom-20 -right-20 w-96 h-96 object-contain transform rotate-180"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="bg-blue-100 px-4 py-2 rounded-lg mb-4 inline-block">
              <span className="text-[#294DB6] font-medium text-[18px]">
                What We Offer
              </span>
            </div>
            <h2 className="text-3xl md:text-[36px] font-bold text-[#101E46]">
              What We Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-6 text-center shadow-lg"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl p-4 transform rotate-3">
                <img
                  src="/About2.png"
                  alt="Team collaboration meeting"
                  className="rounded-xl object-cover w-full h-80 transform -rotate-3"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Mission
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed text-[22px] text-[#101E46]">
                <p>
                  We aim to make international travel accessible by simplifying
                  the complex visa process. With cutting-edge technology, live
                  support, and a user-friendly platform, we empower our clients
                  to focus on their travel plans while we handle the paperwork.
                </p>

                <p>
                  Our commitment to transparency and efficiency ensures that
                  you're always informed about the progress of your application.
                  By leveraging secure document management and automated data
                  extraction, we minimize errors and save you valuable time.
                </p>

                <p className="font-medium text-gray-900">
                  Traveling has never been this easy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
