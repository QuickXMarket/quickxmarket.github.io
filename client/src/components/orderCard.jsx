import React, { useState } from "react";
import { useCoreContext } from "../context/CoreContext";

const OrderCard = ({ order, orderType }) => {
  const { navigate } = useCoreContext();

  return (
    <div className="rounded-lg shadow-md mb-6 border border-gray-200 overflow-hidden w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto transition-all">
      {/* Accordion Header */}
      <div
        className="cursor-pointer bg-gray-50 px-5 py-4 active:bg-gray-100 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`${orderType}/${order._id}`);
        }}
      >
        {/* Order ID */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium break-all">
            {orderType} ID: {order._id}
          </span>
        </div>

        {/* Status and Delivery Fee */}
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <div>
            Status:{" "}
            <span className="text-green-600 font-semibold">{order.status}</span>
          </div>
          <div>
            Fee:{" "}
            <span className="text-primary font-medium">
              ₦
              {orderType === "Errand" || orderType === "Dispatch"
                ? order.deliveryFee
                : order.totalFee}
            </span>
          </div>
        </div>

        {/* Date & Express */}
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          <span
            className={`text-xs font-semibold ${
              order.isExpress ? "text-primary" : "text-gray-400"
            }`}
          >
            {order.isExpress ? "Express" : "Standard"}
          </span>
        </div>
      </div>

      {/* Accordion Body */}
    </div>
  );
};

export default OrderCard;
