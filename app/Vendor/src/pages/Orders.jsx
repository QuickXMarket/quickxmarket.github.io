import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { useCoreContext } from "../context/CoreContext";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const { makeRequest } = useCoreContext();
  const [orders, setOrders] = useState([]);
  const { vendor } = useOutletContext();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const containerRef = useRef();
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await makeRequest({
        url: `/api/order/seller/${vendor._id}`,
        method: "GET",
      });
      if (data.success) {
        setOrders(data.orders);
        const Orders = data.orders;
        const ongoing = Orders.filter(
          (order) =>
            order.status !== "Order Delivered" ||
            order.status === "Order Cancelled"
        );

        const completed = Orders.filter(
          (order) =>
            order.status === "Order Delivered" ||
            order.status === "Order Cancelled"
        );
        setOngoingOrders(ongoing);
        setCompletedOrders(completed);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (vendor && vendor._id) fetchOrders();
  }, [vendor]);

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      const data = await makeRequest({
        url: "/api/order/update-status",
        method: "PATCH",
        data: {
          orderId,
          status,
          vendorId: vendor._id,
        },
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
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        {/* <h2 className="text-lg font-medium">Orders List</h2> */}
        <div className="flex justify-between border-b border-gray-300 mb-4">
          <button
            className={`flex-1 text-center py-2 font-medium ${
              activeTab === "ongoing"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing Orders
          </button>
          <button
            className={`flex-1 text-center py-2 font-medium ${
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
                toggleAccordion={toggleAccordion}
                activeIndex={activeIndex}
                handleOrderStatusUpdate={handleOrderStatusUpdate}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No ongoing orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
