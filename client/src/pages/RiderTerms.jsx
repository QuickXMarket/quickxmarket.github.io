import React from "react";
import { riderTermsData } from "../assets/terms-conditions";

const RiderTerms = () => {
  return (
    <section className="min-h-screen  py-12 bg-white text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {riderTermsData.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Effective Date: {riderTermsData.effectiveDate}
        </p>

        <p className="text-base text-gray-700 mb-8">{riderTermsData.intro}</p>

        <div className="space-y-8">
          {riderTermsData.sections.map((section, index) => (
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
  );
};

export default RiderTerms;
