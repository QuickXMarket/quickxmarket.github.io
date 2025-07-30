import React from "react";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";

const OrderCard = ({ order, index, toggleAccordion, activeIndex }) => {
  const { currency } = useCoreContext();
  return (
    <div className="rounded-md border border-gray-300 overflow-hidden">
      {/* Accordion Header */}
      <div
        onClick={() => toggleAccordion(index)}
        className="flex items-center justify-between  bg-gray-activeIndex 50 px-4 py-3 active:bg-gray-100 cursor-pointer"
      >
        <div className="flex gap-3 items-center">
          <img
            className="w-8 h-8 object-cover"
            src={assets.box_icon}
            alt="boxIcon"
          />
          <div>
            <p className="font-medium text-sm">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {order.paymentType} •{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold">
            {currency}
            {order.amount}
          </p>
          <p
            className={`text-xs ${
              order.isPaid ? "text-green-600" : "text-red-500"
            }`}
          >
            {order.isPaid ? "Paid" : "Pending"}
          </p>
        </div>
      </div>

      {/* Accordion Body */}
      {activeIndex === index && (
        <div className="bg-background px-4 py-3 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Items</h3>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="text-sm flex justify-between py-1 border-b border-gray-200"
              >
                <p>{item.product.name}</p>
                <p>x{item.quantity}</p>
                <p className="text-primary font-semibold">
                  {currency}
                  {item.product.offerPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Shipping Info</h3>
            <p className="text-sm text-text">
              {order.address.address}, {order.address.phone}
            </p>
          </div>
          {order.items.every((item) => item.status === "Order Placed") && (
            <div className="flex gap-3 mt-3">
              <button
                className="flex-1 px-3 py-2 rounded bg-primary text-white text-sm"
                onClick={() =>
                  handleOrderStatusUpdate(order._id, "Order Confirmed")
                }
              >
                Available
              </button>
              <button className="flex-1 px-3 py-2 rounded bg-red-500 text-white text-sm">
                Unavailable
              </button>
            </div>
          )}
          <span className="text-xs text-gray-500">
            *Please confirm that the above Products are available is ordered
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
