import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { useCoreContext } from "../context/CoreContext";
import OrderCard from "../components/OrderCard";
import { useVendorContext } from "../context/VendorContext";

const Orders = () => {
  const { currency, axios } = useCoreContext();
  const { orders, fetchOrders } = useVendorContext();
  const [activeTab, setActiveTab] = useState("ongoing");
  const containerRef = useRef();
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const { vendor } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const data = await axios.patch("/api/order/update-status", {
        orderId,
        status,
        vendorId: vendor._id,
      });
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setActiveIndex(null);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="no-scrollbar flex-1 h-[92vh] overflow-y-scroll max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        <div className="flex justify-between border-b border-gray-300 mb-4 text-sm sm:text-base">
          <button
            className={`flex-1 text-center py-2 font-medium transition-colors ${
              activeTab === "ongoing"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing Orders
          </button>
          <button
            className={`flex-1 text-center py-2 font-medium transition-colors ${
              activeTab === "completed"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4" ref={containerRef}>
          {activeTab === "completed" ? (
            completedOrders?.length > 0 ? (
              completedOrders.map((order, index) => (
                <OrderCard
                  key={index}
                  index={index}
                  order={order}
                  activeIndex={activeIndex}
                  toggleAccordion={toggleAccordion}
                  handleOrderStatusUpdate={handleOrderStatusUpdate}
                />
              ))
            ) : (
              <div className="text-gray-500 text-center">
                No completed orders yet.
              </div>
            )
          ) : ongoingOrders?.length > 0 ? (
            ongoingOrders.map((order, index) => (
              <OrderCard
                key={index}
                index={index}
                order={order}
                activeIndex={activeIndex}
                toggleAccordion={toggleAccordion}
                handleOrderStatusUpdate={handleOrderStatusUpdate}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No ongoing orders yet.
            </div>
          )}
        </div>
        {/* {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            <div className="flex gap-5 max-w-80">
              <img
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <p className="font-medium">
                      {item.product.name}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address.firstName} {order.address.lastName}
              </p>

              <p>{order.address.address}</p>
              <p></p>
              <p>{order.address.phone}</p>
            </div>

            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Orders;
