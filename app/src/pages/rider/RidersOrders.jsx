import React, { useState, useEffect, useRef } from "react";
import RiderOrderCard from "../../components/rider/RiderOrderCard";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import PullToRefresh from "pulltorefreshjs";
import { useCoreContext } from "../../context/CoreContext";
import RiderDispatchCard from "../../components/rider/RiderDispatchCard";

const RidersOrders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { makeRequest } = useCoreContext();
  const [orders, setOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const { rider } = useOutletContext();
  const containerRef = useRef();

  const fetchOrders = async () => {
    try {
      const [orderData, dispatchData] = await Promise.all([
        makeRequest({
          url: `/api/order/rider/${rider._id}`,
          method: "GET",
        }),
        makeRequest({
          url: `/api/dispatch/rider/${rider._id}`,
          method: "GET",
        }),
      ]);

      if (!orderData.success || !dispatchData.success) {
        console.log("error");
        toast.error(orderData.message || dispatchData.message);

        return;
      }

      const statusFlow = [
        "Order Placed",
        "Order Confirmed",
        "Order Assigned",
        "Order Picked",
        "Order Delivered",
      ];

      // Helper to compute overall status for regular orders
      const processOrders = orderData.orders.map((order) => {
        const updatedVendors = order.vendors.map((vendor) => {
          const vendorStatus = vendor.products.reduce((minStatus, product) => {
            const productStatusIndex = statusFlow.indexOf(product.status);
            const minStatusIndex = statusFlow.indexOf(minStatus);
            return productStatusIndex < minStatusIndex
              ? product.status
              : minStatus;
          }, "Order Delivered");

          return { ...vendor, status: vendorStatus };
        });

        const orderStatus = updatedVendors.reduce((minStatus, vendor) => {
          const vendorStatusIndex = statusFlow.indexOf(vendor.status);
          const minStatusIndex = statusFlow.indexOf(minStatus);
          return vendorStatusIndex < minStatusIndex ? vendor.status : minStatus;
        }, "Order Delivered");

        return {
          ...order,
          type: "normal",
          vendors: updatedVendors,
          status: orderStatus,
          createdAt: new Date(order.createdAt),
        };
      });

      // Process dispatch orders
      const processedDispatches = dispatchData.orders.map((dispatch) => ({
        ...dispatch,
        type: "dispatch",
        createdAt: new Date(dispatch.createdAt),
      }));

      // Combine both types
      const allOrders = [...processOrders, ...processedDispatches];

      // Sort so express orders come first, but each group is still chronological
      allOrders.sort((a, b) => {
        if (a.isExpress && !b.isExpress) return -1;
        if (!a.isExpress && b.isExpress) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Filter categories
      const ongoing = allOrders.filter((order) => order.riderId === rider._id);
      const pending = allOrders.filter((order) => !order.riderId);

      // Set states
      setOrders(allOrders);
      setPendingOrders(pending);
      setOngoingOrders(ongoing);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (rider && rider._id) fetchOrders();
  }, [rider]);

  useEffect(() => {
    if (!containerRef.current) return;

    PullToRefresh.init({
      mainElement: containerRef.current,
      onRefresh() {
        return fetchOrders();
      },
    });

    return () => PullToRefresh.destroyAll();
  }, []);

  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
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
        {activeTab === "pending" ? (
          pendingOrders?.length > 0 ? (
            pendingOrders.map((order, index) =>
              order.type === "normal" ? (
                <RiderOrderCard
                  order={order}
                  riderId={rider._id}
                  fetchOrders={fetchOrders}
                  key={index}
                />
              ) : (
                <RiderDispatchCard
                  dispatch={order}
                  riderId={rider._id}
                  fetchOrders={fetchOrders}
                  key={index}
                />
              )
            )
          ) : (
            <div className="text-gray-500 text-center">
              No pending orders yet.
            </div>
          )
        ) : ongoingOrders?.length > 0 ? (
          ongoingOrders.map((order, index) =>
            order.type === "normal" ? (
              <RiderOrderCard
                order={order}
                riderId={rider._id}
                fetchOrders={fetchOrders}
                key={index}
              />
            ) : (
              <RiderDispatchCard
                dispatch={order}
                riderId={rider._id}
                fetchOrders={fetchOrders}
                key={index}
              />
            )
          )
        ) : (
          <div className="text-gray-500 text-center">
            No ongoing orders yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RidersOrders;
