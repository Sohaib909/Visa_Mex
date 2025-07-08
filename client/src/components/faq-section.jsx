

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from '../context/LanguageContext';
import { useFAQs } from '../hooks/useContent';

export default function FAQSection() {
  const { t } = useLanguage();
  const { faqs, loading, error } = useFAQs();
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Fallback FAQ items from translations if no dynamic content
  const fallbackFaqItems = [
    {
      question: t("faq.question1"),
      answer: t("faq.answer1")
    },
    {
      question: t("faq.question2"),
      answer: t("faq.answer2")
    },
    {
      question: t("faq.question3"),
      answer: t("faq.answer3")
    },
    {
      question: t("faq.question4"),
      answer: t("faq.answer4")
    }
  ];

  // Use dynamic content if available, otherwise fallback to translations
  const displayFaqItems = faqs.length > 0 ? faqs : fallbackFaqItems;

  if (loading) {
    return (
      <div className="relative bg-gray-100 py-16 px-4 overflow-hidden">
        {/* Gradient Images */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <img 
            src="/Aboutgradient2.png" 
            alt="" 
            className="absolute -top-32 -right-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
          />
          <img 
            src="/Aboutgradient1.png" 
            alt="" 
            className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          {/* FAQ Header */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2 mx-auto w-16"></div>
              <div className="h-8 bg-gray-300 rounded mx-auto w-64"></div>
            </div>
          </div>

          {/* Loading FAQ Items */}
          <div className="space-y-4 mb-28">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="px-6 py-5">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('FAQ loading error:', error);
    // Continue with fallback content
  }

  return (
    <div className="relative bg-gray-100 py-16 px-4 overflow-hidden">
      {/* Gradient Images - Diagonal positioning (top-right and bottom-left) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="/Aboutgradient2.png" 
          alt="" 
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
        />
        <img 
          src="/Aboutgradient1.png" 
          alt="" 
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] object-contain transform rotate-180"
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* FAQ Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-medium mb-2">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("faq.title")}</h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-28">
          {displayFaqItems.map((item, index) => (
            <div key={item.id || index} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openItems[index] ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openItems[index] && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section - Positioned to extend outside */}
      {/* <div className="absolute left-4 right-4 -bottom-24">
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
      </div> */}
    </div>
  )
}
