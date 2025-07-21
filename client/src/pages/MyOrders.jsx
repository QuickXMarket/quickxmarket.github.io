import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");

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
          className="border border-gray-300 rounded-lg mb-6 overflow-hidden max-w-4xl mx-auto"
        >
          {/* Accordion Header */}
          <div
            onClick={() => toggleAccordion(index)}
            className="cursor-pointer bg-white px-5 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={assets.Favicon_rounded}
                alt="logo"
                className="w-8 h-8 shrink-0"
              />
              <div>
                <p className="text-gray-800 text-sm font-semibold break-all">
                  Order ID: {order._id}
                </p>
                <p className="text-xs text-gray-400">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 sm:text-right">
              <p>
                Status: <span className="text-green-600">{order.status}</span>
              </p>
              <p>
                Total:{" "}
                <span className="font-medium text-primary">
                  {currency}
                  {order.amount}
                </span>
              </p>
            </div>
          </div>

          {/* Accordion Body */}
          {openIndex === index && (
            <div className="border-t border-gray-200">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                    order.items.length !== idx + 1 && "border-b border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <img
                        src={item.product.image[0]}
                        alt=""
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-gray-800 font-medium">
                        {item.product.name}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Category: {item.product.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col text-sm text-gray-500">
                    <p>Qty: {item.quantity || "1"}</p>
                    <p>Status: {item.status}</p>
                  </div>

                  <p className="text-primary font-semibold">
                    {currency}
                    {item.product.offerPrice * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
