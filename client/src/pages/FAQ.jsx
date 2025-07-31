import React, { useState } from "react";

const faqData = {
  title: "Frequently Asked Questions (FAQs) for Customers",
  faqs: [
    {
      question: "What is QuickXMarket?",
      answer:
        "QuickXMarket is an on-campus delivery service designed to help students, faculty, and staff order groceries, food, essentials, and more from local vendors and have them delivered directly to dorms, departments, or pick-up points on campus.",
    },
    {
      question: "Who can use QuickXMarket?",
      answer:
        "All members of the university community, including students, faculty, and staff, can use QuickXMarket. You only need a valid university email address to sign up.",
    },
    {
      question: "How do I place an order?",
      answer:
        "You can place an order through our website or mobile app:\n• Select your vendor\n• Choose your items\n• Enter your delivery details\n• Make payment via wallet, card, or transfer",
    },
    {
      question: "What kinds of items can I order?",
      answer:
        "QuickXMarket offers delivery for:\n• Meals from participating restaurants\n• Snacks and drinks\n• Groceries and toiletries\n• Stationery and study materials\n• Medical essentials from campus pharmacies",
    },
    {
      question: "What are the delivery hours?",
      answer:
        "Delivery is available from 8:00 AM to 9:00 PM, Monday to Saturday. Availability may vary slightly depending on vendor operating hours.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "On average, deliveries are completed within 30–60 minutes after your order is confirmed. You’ll receive updates via email or app notifications.",
    },
    {
      question: "Is there a delivery fee?",
      answer:
        "Yes. Delivery fees range depending on distance, order size, and demand. The exact fee is shown at checkout.",
    },
    {
      question: "Can I schedule an order for later?",
      answer: "No. We do not offer that service for now. Perhaps one day...",
    },
    {
      question: "What if I’m not available when the delivery arrives?",
      answer:
        "Our rider will wait for 5 minutes and attempt to call you. If you’re unreachable, the order may be returned, and you’ll be charged a re-delivery or restocking fee.",
    },
    {
      question: "Can I cancel or change my order?",
      answer:
        "You can cancel your order before the vendor has accepted your order. In the case of dispatch, you can cancel before your dispatch has been assigned to a rider. After that, cancellations are not guaranteed, and refunds may not apply for prepared food.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We accept:\n• Debit/credit cards\n• Bank transfers\n• QuickXMarket wallet\n• USSD payment options",
    },
    {
      question: "How do I track my order?",
      answer:
        "You can track your delivery in real-time via the mobile app or website. You’ll see the order status and estimated arrival time.",
    },
    {
      question: "Is there a minimum order amount?",
      answer:
        "No, there is no minimum order amount. You have the freedom to order how much you want.",
    },
    {
      question: "My order is incorrect or missing items. What should I do?",
      answer:
        "Contact our support team within 30 minutes of receiving the order through the app chat or call the support number. We’ll resolve the issue or offer a credit/refund where appropriate.",
    },
    {
      question: "What is a dispatch request on QuickXMarket?",
      answer:
        "A dispatch request allows you to send items (documents, parcels, or personal packages) from one location on campus to another using QuickXMarket’s delivery riders.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Support is available from 8 AM to 9 PM through:\n• In-app chat\n• Email: \n• Phone: ",
    },
  ],
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="min-h-screen px-4 py-12 bg-gray-50">
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
