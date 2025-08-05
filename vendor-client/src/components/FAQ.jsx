import React, { useState } from "react";

const faqData = {
  title: "Frequently Asked Questions (FAQs) for Vendors",
  faqs: [
    {
      question: "What is QuickXMarket?",
      answer:
        "QuickXMarket is an on-demand delivery service designed to connect university students and staff with local vendors for quick and reliable access to food, groceries, school supplies, and other essentials.",
    },
    {
      question: "Who can become a vendor on the platform?",
      answer:
        "Any registered business or individual seller offering goods suitable for students (e.g., food, snacks, toiletries, academic materials, electronics, etc.) can apply to become a vendor. You must meet our quality, safety, and delivery standards.",
    },
    {
      question: "How do I register as a vendor?",
      answer:
        "You can register through our website or app. The process includes:\n\n- Filling out the vendor registration form\n- Submitting your business registration (if available)\n- Uploading product menus or catalogs\n- Agreeing to our vendor terms and conditions",
    },
    {
      question: "Is there a commission or service fee?",
      answer:
        "Yes. QuickXMarket charges a small commission on each order to cover operational and rider costs. The exact percentage will be shared during onboarding and depends on your category and sales volume.",
    },
    {
      question: "How do I receive orders?",
      answer:
        "Once registered, you will receive orders via the vendor dashboard or mobile app. You’ll be notified in real-time and can confirm preparation and delivery status.",
    },
    {
      question: "Who handles the delivery?",
      answer:
        "QuickXMarket provides trained delivery riders who will pick up orders and deliver them directly to students or staff within the campus area or nearby hostels.",
    },
    {
      question: "What are the delivery time expectations?",
      answer:
        "Vendors are expected to prepare orders within 10–20 minutes (depending on item type). Our delivery team aims to complete deliveries within 30–45 minutes of order placement.",
    },
    {
      question: "How are payments processed?",
      answer:
        "Payments are processed after 1 working day to your designated bank account. A transaction breakdown will be provided in your vendor dashboard.",
    },
    {
      question: "Can I update my menu or product listings?",
      answer:
        "Yes. Vendors have full access to their menus/catalogs through the dashboard. You can update pricing, availability, and new products anytime.",
    },
    {
      question: "What happens if I miss or delay an order?",
      answer:
        "Repeated order delays or cancellations may affect your rating and visibility on the platform. We encourage prompt communication if an item is unavailable or delayed.",
    },
    {
      question: "Do I need to offer discounts or promotions?",
      answer:
        "Discounts are optional but encouraged during student events or peak periods. QuickXMarket often runs campaigns and may feature your store if you participate.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our Vendor Support team via:\n\n- In-app chat\n- Email: \n- Hotline:",
    },
  ],
};

const FAQ = ({ ref }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-gray-50 mt-32" id="faq" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">
          {faqData.title}
        </h2>

        <div className="space-y-4">
          {faqData.faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white shadow-sm"
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
