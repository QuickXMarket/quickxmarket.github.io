import React from "react";
import { vendorTermsData } from "../assets/terms-conditions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TermsandConditions = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <section className="min-h-screen  py-12 bg-white text-gray-800">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {vendorTermsData.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Effective Date: {vendorTermsData.effectiveDate}
            </p>

            <p className="text-base text-gray-700 mb-8">
              {vendorTermsData.intro}
            </p>

            <div className="space-y-8">
              {vendorTermsData.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-lg font-semibold text-primary mb-2">
                    {section.heading}
                  </h2>
                  <ul className="list-disc pl-6 space-y-1">
                    {section.content.map((item, i) => (
                      <li key={i} className="text-gray-700 whitespace-pre-line">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TermsandConditions;
