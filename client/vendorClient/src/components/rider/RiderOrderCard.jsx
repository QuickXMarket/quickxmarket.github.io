import React, { useState } from "react";
import toast from "react-hot-toast";
import DeliveryCodeModal from "./DeliveryCodeModal";
import { useCoreContext } from "../../context/CoreContext";

const RiderOrderCard = ({ order, riderId, fetchOrders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { makeRequest } = useCoreContext();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  const orderStatusActions = [
    {
      status: "Order Confirmed",
      buttonText: "Accept Order",
      newStatus: "Order Assigned",
    },
    {
      status: "Order Assigned",
      buttonText: "Pick Order",
      newStatus: "Order Picked",
    },
    {
      status: "Order Picked",
      buttonText: "Deliver Order",
      newStatus: "Order Delivered",
    },
  ];

  const handleBtnClick = async () => {
    try {
      if (order.status === "Order Confirmed" && !order.riderId) {
        const data = await makeRequest({
          url: `/api/order/accept`,
          method: "POST",
          data: { orderId: order._id, riderId },
        });
        if (data.success) {
          toast.success("Order accepted successfully");
          fetchOrders();
        } else {
          toast.error(data.message);
        }
      } else {
        const action = orderStatusActions.find(
          (action) => action.status === order.status
        );
        if (action) {
          if (order.status === "Order Picked") {
            setShowCodeModal(true);
            return;
          }
          const data = await makeRequest({
            url: "/api/order/update-status",
            method: "PATCH",
            data: {
              orderId: order._id,
              status: action.newStatus,
            },
          });
          if (data.success) {
            toast.success("Order status updated successfully");
            fetchOrders();
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch {}
  };

  return (
    <div className="rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        onClick={toggleAccordion}
        className="cursor-pointer bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 active:bg-gray-100 transition-all"
      >
        {/* Order ID, Date & Overall Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">
            Order ID: {order._id}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Customer Info */}
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{`${order.address.firstName} ${order.address.lastName}`}</p>
            <p className="text-xs text-gray-500">{order.address.address}</p>
          </div>
          {order.address.phone && (
            <a
              href={`tel:${order.address.phone}`}
              className="text-sm text-primary font-medium whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              {order.address.phone}
            </a>
          )}
        </div>

        {/* Overall Status */}
        <div className="flex justify-between items-center mt-1">
          <span className=" text-xs text-green-600 font-semibold">
            Status: {order.status}
          </span>
          <button
            className=" bg-primary text-white text-sm px-3 py-1 rounded hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              handleBtnClick();
            }}
          >
            {orderStatusActions.find((action) => action.status === order.status)
              ?.buttonText || "Update Status"}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="bg-white px-4 py-3 sm:px-6 sm:py-4 space-y-4">
          {order.vendors.map((vendor, index) => (
            <div key={index} className="border-t border-gray-200 pt-4">
              {/* Vendor Info */}
              <div className="flex justify-between gap-4 text-sm">
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">
                    {vendor.vendor.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {vendor.vendor.address}
                  </p>
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    Vendor Status: {vendor.status}
                  </p>
                </div>
                {vendor.vendor.phone && (
                  <a
                    href={`tel:${vendor.vendor.phone}`}
                    className="text-sm text-primary font-medium whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {vendor.vendor.phone}
                  </a>
                )}
              </div>

              {/* Product List */}
              <div className="mt-3 space-y-2">
                {vendor.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm items-center"
                  >
                    <p className="text-gray-700">
                      {product.name} × {product.quantity}
                    </p>
                    <p className="font-bold text-primary">
                      ₦{product.totalPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {showCodeModal && (
        <DeliveryCodeModal
          orderId={order._id}
          onClose={() => setShowCodeModal(false)}
          fetchOrders={fetchOrders}
          riderId={riderId}
          type={"normal"}
        />
      )}
    </div>
  );
};

export default RiderOrderCard;
