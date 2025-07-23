import React, { useState, useRef } from "react";
import PlusIcon from "../assets/plus.svg?react";
import { useCoreContext } from "../context/CoreContext";

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const containerRef = useRef();
  const { navigate } = useCoreContext();

  return (
    <>
      <div className="py-2 w-full max-w-2xl mx-auto">
        {/* Top Tabs */}
        <div className="flex justify-between border-b border-gray-300 mb-4">
          <button
            className={`flex-1 text-center py-2 font-medium ${
              activeTab === "pending"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Orders
          </button>
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
        </div>

        {/* Orders List */}
        <div className="space-y-4" ref={containerRef}>
          {/* {activeTab === "pending" ? (
          pendingOrders?.length > 0 ? (
            pendingOrders.map((order, index) => (
              <RiderOrderCard
                order={order}
                riderId={rider._id}
                fetchOrders={fetchOrders}
                key={index}
              />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No pending orders yet.
            </div>
          )
        ) : ongoingOrders?.length > 0 ? (
          ongoingOrders.map((order, index) => (
            <RiderOrderCard
              order={order}
              riderId={rider._id}
              fetchOrders={fetchOrders}
              key={index}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center">
            No ongoing orders yet.
          </div>
        )} */}
        </div>
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={() => navigate("/dispatch-request")}
          className="bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        >
          <PlusIcon className={"w-10 h-10"} />
        </button>
      </div>
    </>
  );
};

export default Dispatch;
