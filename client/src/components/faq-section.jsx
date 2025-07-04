

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useLanguage } from '../context/LanguageContext';

export default function FAQSection() {
  const { t } = useLanguage();
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const faqItems = [
    {
      question: "What documents are required for a visa application?",
      answer:
        "You'll typically need a valid passport, completed application form, passport-sized photos, proof of financial support, travel itinerary, and any specific documents required for your visa type.",
    },
    {
      question: "How long does the visa process take?",
      answer:
        "Processing times vary by country and visa type, typically ranging from 5-30 business days. We provide real-time tracking so you're always informed about your application status.",
    },
    {
      question: "Is my information secure?",
      answer:
        "Yes, we use bank-level encryption and secure document management systems to protect your personal information and documents throughout the entire process.",
    },
    {
      question: "What documents are required for a visa application?",
      answer:
        "You'll typically need a valid passport, completed application form, passport-sized photos, proof of financial support, travel itinerary, and any specific documents required for your visa type.",
    },
    {
      question: "Is my information secure?",
      answer:
        "Yes, we use bank-level encryption and secure document management systems to protect your personal information and documents throughout the entire process.",
    },
    {
      question: "How long does the visa process take?",
      answer:
        "Processing times vary by country and visa type, typically ranging from 5-30 business days. We provide real-time tracking so you're always informed about your application status.",
    },
  ]

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
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
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
