import { useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "What documents are required for a visa application?",
      answer: "For a visa application, you typically need: a valid passport with at least 6 months validity, completed visa application form, recent passport-sized photographs, proof of travel arrangements (flight bookings), proof of accommodation, financial statements or bank statements, travel insurance, and any specific documents required for your visa type. Requirements may vary depending on your nationality and destination country."
    },
    {
      question: "How long does the visa process take?",
      answer: "Visa processing times vary depending on the type of visa and destination country. Tourist visas typically take 3-15 business days, while work or study visas may take 2-8 weeks. Some countries offer expedited processing for an additional fee. We recommend applying well in advance of your planned travel date to avoid any delays."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, your information is completely secure. We use industry-standard encryption protocols to protect your personal and financial data. All documents are stored in secure, encrypted databases with restricted access. We comply with international data protection regulations and never share your information with unauthorized third parties."
    },
    {
      question: "What documents are required for a visa application?",
      answer: "For a visa application, you typically need: a valid passport with at least 6 months validity, completed visa application form, recent passport-sized photographs, proof of travel arrangements (flight bookings), proof of accommodation, financial statements or bank statements, travel insurance, and any specific documents required for your visa type. Requirements may vary depending on your nationality and destination country."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, your information is completely secure. We use industry-standard encryption protocols to protect your personal and financial data. All documents are stored in secure, encrypted databases with restricted access. We comply with international data protection regulations and never share your information with unauthorized third parties."
    },
    {
      question: "How long does the visa process take?",
      answer: "Visa processing times vary depending on the type of visa and destination country. Tourist visas typically take 3-15 business days, while work or study visas may take 2-8 weeks. Some countries offer expedited processing for an additional fee. We recommend applying well in advance of your planned travel date to avoid any delays."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="w-full py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Gradient Images - Reversed diagonal positioning */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img 
          src="/Aboutgradient1.png" 
          alt="" 
          className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] object-contain transform rotate-270"
        />
        <img 
          src="/Aboutgradient2.png" 
          alt="" 
          className="absolute -top-32 -left-32 w-[32rem] h-[32rem] object-contain transform rotate-1270"
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: "rgba(85, 118, 217, 0.2)" }}>
            <p className="text-xs font-medium tracking-wide" style={{ color: "#294DB6" }}>FAQ</p>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1B3276]">Frequently Asked Questions</h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[#1B3276] pr-3 sm:pr-4">
                  {faq.question}
                </h3>
                <ChevronDownIcon 
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              <div className={`overflow-hidden transition-all duration-300 ${
                openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection 