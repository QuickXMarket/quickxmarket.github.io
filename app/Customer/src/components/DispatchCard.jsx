import React, { useState } from "react";

const DispatchCard = ({ dispatch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="rounded-lg shadow-md mb-6 border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      {/* Accordion Header */}
      <div
        onClick={toggleAccordion}
        className="cursor-pointer bg-gray-50 px-5 py-4 active:bg-gray-100 transition-all"
      >
        {/* Order ID */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium break-all">
            Dispatch ID: {dispatch._id}
          </span>
        </div>

        {/* Status and Delivery Fee */}
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <div>
            Status:{" "}
            <span className="text-green-600 font-semibold">
              {dispatch.status}
            </span>
          </div>
          <div>
            Fee:{" "}
            <span className="text-primary font-medium">
              ₦{dispatch.deliveryFee}
            </span>
          </div>
        </div>

        {/* Date & Express */}
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{new Date(dispatch.createdAt).toLocaleDateString()}</span>
          <span
            className={`text-xs font-semibold ${
              dispatch.isExpress ? "text-primary" : "text-gray-400"
            }`}
          >
            {dispatch.isExpress ? "Express" : "Standard"}
          </span>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="bg-background px-5 py-4 space-y-4 border-t border-gray-200 text-sm text-gray-700">
          {/* Dropoff Details */}
          <div className="space-y-1">
            <p>
              <span className="font-medium text-gray-500">Dropoff Name:</span>{" "}
              {dispatch.dropoff.firstName} {dispatch.dropoff.lastName}
            </p>
            <p>
              <span className="font-medium text-gray-500">Phone:</span>{" "}
              {dispatch.dropoff.phone}
            </p>
            <p>
              <span className="font-medium text-gray-500">Address:</span>{" "}
              {dispatch.dropoff.address}
            </p>
          </div>

          {/* Delivery Note */}
          {dispatch.deliveryNote && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-600 mb-1">Delivery Note</p>
              <p className="text-gray-700">{dispatch.deliveryNote}</p>
            </div>
          )}

          {/* Delivery Code */}
          {dispatch.deliveryCode && (
            <div className="flex justify-center gap-2 mt-2">
              {dispatch.deliveryCode.split("").map((digit, i) => (
                <div
                  key={i}
                  className="w-10 h-12 flex items-center justify-center border border-gray-300 rounded-md text-lg font-semibold text-gray-700 bg-gray-50"
                >
                  {digit}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DispatchCard;
