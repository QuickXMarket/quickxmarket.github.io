import React from "react";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const { rider } = useOutletContext();

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      {/* Rider Profile Card */}
      <div className="bg-card rounded-2xl shadow-md px-6 py-4 relative">
        {/* Edit Button */}
        <button className="absolute top-4 right-4 text-primary text-sm font-medium hover:underline">
          Edit Details
        </button>

        {/* Name */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {rider?.name || "Rider Name"}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
          <div>
            <span className="font-medium  text-xs text-gray-500 block">
              Phone Number
            </span>
            {rider?.number || "N/A"}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium  text-xs text-gray-500 block">
              Vehicle Type
            </span>
            {rider?.vehicleType || "N/A"}
          </div>
          <div>
            <span className="font-medium text-xs text-gray-500 block">
              Successful Deliveries
            </span>
            {rider?.successfulDeliveries ?? 0}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-xs text-gray-500 block">
              Distance Covered
            </span>
            {rider?.distanceCovered ? `${rider.distanceCovered} km` : "0 km"}
          </div>
        </div>
      </div>

      {/* Completed Orders List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Completed Orders
        </h3>

        {rider?.completedOrders?.length === 0 ? (
          <p className="text-sm text-gray-500">No completed orders yet.</p>
        ) : (
          rider?.completedOrders?.map((order, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3"
            >
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Order ID: {order._id}</span>
                <span className="text-primary font-semibold">
                  ₦{order.deliveryPrice.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>
                  Placed: {new Date(order.placedAt).toLocaleDateString()}
                </span>
                <span>
                  Completed: {new Date(order.completedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
