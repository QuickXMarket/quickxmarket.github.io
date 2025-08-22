import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import { useCoreContext } from "../context/CoreContext";
import PullToRefresh from "pulltorefreshjs";

const Profile = () => {
  const { rider, verifyRider } = useAuthContext();
  const { makeRequest } = useCoreContext();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [completedDispatch, setCompletedDispatch] = useState([]);
  const [completedErrands, setCompletedErrands] = useState([]);
  const [distanceCovered, setDisanceCovered] = useState(0);
  const [successDeliveries, setSuccesDeliveries] = useState(0);
  const containerRef = useRef();

  const getCompletedOrders = async () => {
    try {
      const data = await makeRequest({
        url: `/api/rider/completedOrders/${rider._id}`,
        method: "GET",
      });

      if (data.success) {
        const processedOrders = data.orders.map((order) => ({
          ...order,
          type: "normal",
          createdAt: new Date(dispatch.createdAt),
        }));

        const processedDispatches = data.dispatchOrders.map((dispatch) => ({
          ...dispatch,
          type: "dispatch",
          createdAt: new Date(dispatch.createdAt),
        }));

        const processedErrands = data.errands.map((errand) => ({
          ...errand,
          type: "errand",
          createdAt: new Date(errand.createdAt),
        }));

        const allOrders = [
          ...processedOrders,
          ...processedDispatches,
          ...processedErrands,
        ];

        allOrders.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setSuccesDeliveries(allOrders.length);
        setCompletedOrders(data.orders);
        setCompletedDispatch(data.dispatchOrders);
        setCompletedErrands(data.errands);
      } else {
        toast.error("Not a valid rider account");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (rider) getCompletedOrders();
  }, [rider]);

  useEffect(() => {
    if (!containerRef.current) return;

    PullToRefresh.init({
      mainElement: containerRef.current,
      onRefresh() {
        return getCompletedOrders();
      },
    });

    return () => PullToRefresh.destroyAll();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      {/* Rider Profile Card */}
      <div className="bg-card rounded-2xl shadow-md px-6 py-6 relative flex flex-col items-center">
        {/* Edit Button */}
        <button className="absolute top-4 right-4 text-primary text-sm font-medium hover:underline">
          Edit Details
        </button>

        {/* Profile Picture */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
          <img
            src={rider?.profilePic || assets.profile_icon}
            alt="Rider Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {rider?.name || "Rider Name"}
        </h2>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600 w-full">
          <div>
            <span className="font-medium text-xs text-gray-500 block">
              Phone Number
            </span>
            {rider?.number || "N/A"}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-xs text-gray-500 block">
              Vehicle Type
            </span>
            {rider?.vehicleType || "N/A"}
          </div>
          <div>
            <span className="font-medium text-xs text-gray-500 block">
              Successful Deliveries
            </span>
            {successDeliveries ?? 0}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-xs text-gray-500 block">
              Distance Covered
            </span>
            {distanceCovered ? `${distanceCovered} km` : "0 km"}
          </div>
        </div>
      </div>

      {/* Completed Orders List */}
      <div className="space-y-3" ref={containerRef}>
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
