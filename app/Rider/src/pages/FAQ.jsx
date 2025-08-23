import React, { useState } from "react";

const faqData = {
  title: "QuickXMarket - Delivery Rider FAQs",
  faqs: [
    {
      question: "What is QuickXMarket?",
      answer:
        "QuickXMarket is an on-demand delivery service operating within a university environment. Riders pick up orders from vendors (restaurants, stores, individuals) and deliver them to students, staff, and faculty around campus.",
    },
    {
      question: "How do I become a QuickXMarket delivery rider?",
      answer:
        "To become a rider, you need to:\n• Register on the QuickXMarket Rider Portal or App\n• Submit valid ID (national or university ID)\n• Provide your own means of transportation (bike, motorcycle, or bicycle)\n• Attend a short onboarding session (in-person or virtual)",
    },
    {
      question: "What kind of deliveries will I handle?",
      answer:
        "You may deliver:\n• Food from vendors on and around campus\n• Groceries and personal essentials\n• Documents or parcels from one location to another (dispatch requests)",
    },
    {
      question: "How are deliveries assigned?",
      answer:
        "Deliveries are assigned based on:\n• Your proximity to the pickup location\n• Your availability and online status\n• Your delivery rating and performance history\n\nYou’ll receive a notification with the order details and can accept or reject it in the app.",
    },
    {
      question: "What are the working hours?",
      answer:
        "You can work flexible hours. The platform typically operates from 8:00 AM to 9:00 PM, Monday to Sunday. You can log in and out as your schedule permits.",
    },
    {
      question: "How much can I earn?",
      answer:
        "Riders earn per delivery. Earnings depend on:\n• Distance covered\n• Order volume and time of day\n• Bonus incentives during peak hours or campaigns\n\nPayouts are made 1 working day after request to your bank or wallet.",
    },
    {
      question: "Are there any bonuses or incentives?",
      answer:
        "Yes, you may earn bonuses for:\n• Completing a certain number of deliveries in a day/week\n• High customer ratings\n• Referring other riders\n• Working during peak demand times",
    },
    {
      question: "What should I wear while delivering?",
      answer:
        "You are expected to wear clean, comfortable clothing. Riders may be given QuickXMarket-branded bags or gear, which must be used for visibility and hygiene.",
    },
    {
      question: "What do I do if I can’t complete a delivery?",
      answer:
        "If you run into a problem:\n• Contact QuickXMarket Rider Support immediately via the app or helpline\n• Provide the reason (bike issue, customer unavailable, etc.)\n• Do not abandon or hand over the order to anyone else without permission",
    },
    {
      question: "What happens if a customer is unreachable?",
      answer:
        "Wait at the drop-off point and attempt to contact the customer.\n• Wait up to 5 minutes\n• If still unreachable, contact support\n• The item may be returned or held at a designated pickup point",
    },
    {
      question: "What if there’s an issue with the order?",
      answer:
        "If an item is damaged, missing, or incorrect:\n• Notify support immediately\n• Do not tamper with or alter the package\n• Let the platform or vendor handle replacement or refund issues",
    },
    {
      question: "Do I need insurance or a license?",
      answer:
        "While QuickXMarket doesn’t require formal vehicle insurance, you are responsible for your own safety.\n• Riders must follow all traffic rules\n• You may be required to show basic documentation depending on the university or local policies",
    },
    {
      question: "Can I choose which deliveries to accept?",
      answer:
        "Yes, but declining too many orders may affect your priority status or bonuses. Try to only log in when available to accept deliveries.",
    },
    {
      question: "How do I track my performance?",
      answer:
        "You can view your delivery history, earnings, and customer ratings directly from the Rider App.",
    },
    {
      question: "Who do I contact for support?",
      answer:
        "For help with orders, payment, or technical issues, contact:\n📧 \n📞 \n🟢 In-app live chat (available 8 AM – 9 PM)",
    },
  ],
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="min-h-screen  py-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">
          {faqData.title}
        </h2>

        <div className="space-y-4">
          {faqData.faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-5 text-left text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-t-xl"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180 text-primary" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeIndex === index && (
                <div className="px-5 pb-5 pt-2 text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
