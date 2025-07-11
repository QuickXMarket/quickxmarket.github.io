import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import RiderOrderCard from "../../components/rider/RiderOrderCard";

const RidersOrders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const { makeRequest } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const { riderId } = useOutletContext();

  const fetchOrders = async () => {
    try {
      const data = await makeRequest({
        url: `/api/order/rider${riderId}`,
        method: "GET",
      });

      if (data.success) {
        const statusFlow = [
          "Order Placed",
          "Order Confirmed",
          "Order Picked",
          "Order Delivered",
        ];

        const modifiedOrders = data.orders.map((order) => {
          // Loop through each vendor and compute their status
          const updatedVendors = order.vendors.map((vendor) => {
            const vendorStatus = vendor.products.reduce(
              (minStatus, product) => {
                const productStatusIndex = statusFlow.indexOf(product.status);
                const minStatusIndex = statusFlow.indexOf(minStatus);
                return productStatusIndex < minStatusIndex
                  ? product.status
                  : minStatus;
              },
              "Order Delivered"
            );

            return { ...vendor, status: vendorStatus };
          });

          //  Compute overall order status from vendor statuses
          const orderStatus = updatedVendors.reduce((minStatus, vendor) => {
            const vendorStatusIndex = statusFlow.indexOf(vendor.status);
            const minStatusIndex = statusFlow.indexOf(minStatus);
            return vendorStatusIndex < minStatusIndex
              ? vendor.status
              : minStatus;
          }, "Order Delivered");

          return {
            ...order,
            vendors: updatedVendors,
            status: orderStatus,
          };
        });

        setOrders(modifiedOrders);

        const pending = modifiedOrders.filter(
          (order) => order.status !== "Order Delivered"
        );
        setPendingOrders(pending);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // const orders = [{
  //   _id: "ORD123456",
  //   createdAt: "2025-07-07T14:00:00Z",
  //   customer: {
  //     name: "Jane Doe",
  //     address: "123 Main St, Ikeja",
  //     phone: "08012345678",
  //   },
  //   vendors: [
  //     {
  //       name: "Vendor One",
  //       address: "45 Broad Street, Lagos",
  //       phone: "08098765432",
  //       products: [
  //         { name: "Tomatoes", quantity: 2, totalPrice: 1000 },
  //         { name: "Onions", quantity: 3, totalPrice: 1500 },
  //       ],
  //     },
  //     {
  //       name: "Vendor Two",
  //       address: "12 Market Road, Abuja",
  //       phone: "08011223344",
  //       products: [{ name: "Rice", quantity: 1, totalPrice: 5000 }],
  //     },
  //   ],
  // }];

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
      <div className="space-y-4">
        {activeTab === "pending" ? (
          orders?.length > 0 ? (
            orders.map((order, index) => (
              <RiderOrderCard order={order} key={index} />
            ))
          ) : (
            <div className="text-gray-500 text-center">
              No pending orders yet.
            </div>
          )
        ) : ongoingOrders?.length > 0 ? (
          ongoingOrders.map((order, index) => (
            <RiderOrderCard order={order} key={index} />
          ))
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
