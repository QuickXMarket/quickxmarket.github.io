import React, { useState } from "react";

const RiderOrderCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        onClick={toggleAccordion}
        className="cursor-pointer bg-gray-50 px-4 py-3 active:bg-gray-100 transition-all"
      >
        {/* Order ID and Date */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-primary font-medium">
            Order ID: {order._id}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Customer Info */}
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{`${order.address.firstName} ${order.address.lastName}`}</p>
            <p className="text-xs text-gray-500">{order.address.address}</p>
          </div>
          <p className="text-sm text-gray-600 whitespace-nowrap">
            {order.address.phone}
          </p>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="bg-white px-4 py-3 space-y-4">
          {order.vendors.map((vendor, index) => (
            <div key={index} className="border-t border-gray-200 pt-4">
              {/* Vendor Info */}
              <div className="flex justify-between gap-4 text-sm">
                <div className="flex-1">
                  <p className="font-semibold text-primary">{vendor.name}</p>
                  <p className="text-xs text-gray-500">{vendor.address}</p>
                </div>
                <p className="text-sm text-gray-600 whitespace-nowrap">
                  {vendor.phone}
                </p>
              </div>

              {/* Product List */}
              <div className="mt-3 space-y-2">
                {vendor.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm items-center"
                  >
                    <p className="text-gray-700">
                      {product.name} × {product.quantity}
                    </p>
                    <p className="font-bold text-primary">
                      ₦{product.totalPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RiderOrderCard;
