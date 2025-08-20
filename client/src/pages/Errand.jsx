import React, { useState, useRef, useEffect } from "react";
import PlusIcon from "../assets/plus.svg?react";
import { useCoreContext } from "../context/CoreContext";
import { useAuthContext } from "../context/AuthContext";
import OrderCard from "../components/orderCard";
import toast from "react-hot-toast";

const Errand = () => {
  const { navigate, axios } = useCoreContext();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("ongoing");
  const containerRef = useRef();
  const [orders, setOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/errand/user`);

      if (data.success) {
        const Orders = data.orders;
        setOrders(Orders);

        const ongoing = Orders.filter(
          (order) => order.status !== "Order Delivered"
        );

        const completed = Orders.filter(
          (order) =>
            order.status === "Order Delivered" ||
            order.status === "Order Cancelled"
        );
        setCompletedOrders(completed);
        setOngoingOrders(ongoing);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user._id) fetchOrders();
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">Errands</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      <div className="py-2 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 min-h-[300px]">
        {/* Top Tabs */}
        <div className="flex justify-between border-b border-gray-300 mb-4 text-sm sm:text-base">
          <button
            className={`flex-1 text-center py-2 font-medium transition-colors cursor-pointer ${
              activeTab === "ongoing"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing Orders
          </button>
          <button
            className={`flex-1 text-center py-2 font-medium transition-colors cursor-pointer ${
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
                <OrderCard order={order} orderType={"Errand"} key={index} />
              ))
            ) : (
              <div className="text-gray-500 text-center">
                No completed orders yet.
              </div>
            )
          ) : ongoingOrders?.length > 0 ? (
            ongoingOrders.map((order, index) => (
              <OrderCard order={order} orderType={"Errand"} key={index} />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No ongoing orders yet.
            </div>
          )}
        </div>
      </div>
      {/* Floating Button */}
      <div className="fixed bottom-22 right-6 sm:right-10 lg:right-14 z-50 ">
        <button
          onClick={() => navigate("/errand-request")}
          className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer"
        >
          <PlusIcon className={"w-10 h-10"} />
        </button>
      </div>
    </div>
  );
};

export default Errand;
