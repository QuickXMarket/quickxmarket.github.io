import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAuthContext } from "../context/AuthContext";
import { useCoreContext } from "../context/CoreContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { user } = useAuthContext();
  const { currency, makeRequest } = useCoreContext();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchMyOrders = async () => {
    try {
      const data = await makeRequest({ method: "GET", url: "/api/order/user" });

      if (data.success) {
        const statusFlow = [
          "Order Placed",
          "Order Confirmed",
          "Order Assigned",
          "Order Picked",
          "Order Delivered",
        ];

        const updatedOrders = data.orders.map((order) => {
          // Get the lowest status in the flow
          const lowestStatus = order.items.reduce((minStatus, item) => {
            const itemStatusIndex = statusFlow.indexOf(item.status);
            const currentMinIndex = statusFlow.indexOf(minStatus);
            return itemStatusIndex < currentMinIndex ? item.status : minStatus;
          }, "Order Delivered");

          return { ...order, status: lowestStatus };
        });

        setMyOrders(updatedOrders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      {myOrders.map((order, index) => (
        <div
          key={index}
          className="rounded-lg shadow-md mb-6 border border-gray-200 overflow-hidden max-w-4xl mx-auto"
        >
          {/* Accordion Header */}
          <div
            onClick={() => toggleAccordion(index)}
            className="cursor-pointer bg-gray-50 px-5 py-4 active:bg-gray-100 transition-all"
          >
            {/* Order ID & Date */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium break-all">
                Order ID: {order._id}
              </span>
            </div>

            {/* Status and Total */}
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <div>
                Status:{" "}
                <span className="text-green-600 font-semibold">
                  {order.status}
                </span>
              </div>
              <div>
                Total:{" "}
                <span className="text-primary font-medium">
                  {currency}
                  {order.amount}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Accordion Body */}
          {openIndex === index && (
            <div className="bg-background px-5 py-4 space-y-4 border-t border-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4`}
                >
                  {/* Image */}
                  <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                    <img
                      src={item.product.image[0]}
                      alt=""
                      className="w-16 h-16 object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="min-w-[150px] flex-1">
                    <p className="text-gray-800 font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Category: {item.product.category}
                    </p>
                  </div>

                  {/* Quantity & Status */}
                  <div className="text-sm text-gray-500 space-y-1 min-w-[100px] text-left">
                    <p>Qty: {item.quantity || "1"}</p>
                    <p>Status: {item.status}</p>
                  </div>

                  {/* Price */}
                  <div className="text-primary font-semibold whitespace-nowrap min-w-[80px] text-right">
                    {currency}
                    {item.product.offerPrice * item.quantity}
                  </div>
                </div>
              ))}

              {/* Optional 4-digit code */}
              {order.deliveryCode && (
                <div className="flex justify-center gap-2 mt-2">
                  {order.deliveryCode.split("").map((digit, i) => (
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
      ))}
    </div>
  );
};

export default MyOrders;
