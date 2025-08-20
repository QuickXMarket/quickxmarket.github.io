import React, { useState } from "react";
import toast from "react-hot-toast";
import DeliveryCodeModal from "./DeliveryCodeModal";
import { useCoreContext } from "../context/CoreContext";

const DispatchCard = ({ dispatch, riderId, fetchOrders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { makeRequest } = useCoreContext();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  const dispatchStatusActions = [
    {
      status: "Order Placed",
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
      if (dispatch.status === "Order Placed" && !dispatch.riderId) {
        const data = await makeRequest({
          url: `/api/dispatch/accept`,
          method: "POST",
          data: { dispatchId: dispatch._id, riderId },
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
            url: "/api/dispatch/update-status",
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
        className="cursor-pointer bg-gray-50 px-4 py-3 active:bg-gray-100 transition-all"
      >
        {/* Dispatch ID & Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">
            Dispatch ID: {dispatch._id}
          </span>
          <span
            className={`text-xs font-semibold ${
              dispatch.isExpress ? "text-primary" : "text-gray-400"
            }`}
          >
            {dispatch.isExpress ? "Express" : "Standard"}
          </span>
        </div>

        {/* Dropoff Name & Phone */}
        <div className="mt-2 flex justify-between items-center gap-4 text-sm">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {dispatch.pickupAddress
                ? ` ${dispatch.pickupAddress.firstName} 
              ${dispatch.pickupAddress.lastName}`
                : `${dispatch.pickupAddressDetails.name}`}
            </p>
            <p className="text-xs text-gray-500">
              {dispatch.pickupAddress
                ? ` ${dispatch.pickupAddress.address}`
                : `${dispatch.pickupAddressDetails.address}`}
            </p>
          </div>
          <a
            href={`tel:${
              dispatch.pickupAddress
                ? dispatch.pickupAddress.phone
                : dispatch.pickupAddressDetails.phone
            }`}
            className="text-sm text-primary font-medium whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {dispatch.pickupAddress
              ? ` ${dispatch.pickupAddress.phone}`
              : `${dispatch.pickupAddressDetails.phone}`}
          </a>
        </div>

        {/* Status & Button */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-green-600 font-semibold">
            Status: {dispatch.status}
          </span>
          <button
            className="bg-primary text-white text-sm px-3 py-1 rounded hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              handleBtnClick();
            }}
          >
            {}
            {dispatchStatusActions.find((a) => a.status === dispatch.status)
              ?.buttonText || "Update Status"}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="bg-background px-4 py-3 space-y-4 border-t border-gray-200 text-sm text-gray-700">
          {/* Dropoff Details */}
          <h3 className="mb-1">Dropoff Details</h3>
          <div className=" flex justify-between items-center gap-4 text-sm">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {dispatch.dropoff.firstName
                  ? ` ${dispatch.dropoff.firstName} 
              ${dispatch.dropoff.lastName}`
                  : `${dispatch.dropoff.name}`}
              </p>
              <p className="text-xs text-gray-500">
                {dispatch.dropoff.address}
              </p>
            </div>
            {dispatch.dropoff.phone && (
              <a
                href={`tel:${dispatch.dropoff.phone}`}
                className="text-sm text-primary font-medium whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                {dispatch.dropoff.phone}
              </a>
            )}
          </div>

          {/* Delivery Note */}
          {dispatch.deliveryNote && (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-medium text-gray-600 mb-1">Delivery Note</p>
              <p className="text-gray-700">{dispatch.deliveryNote}</p>
            </div>
          )}
        </div>
      )}
      {showCodeModal && (
        <DeliveryCodeModal
          orderId={dispatch._id}
          onClose={() => setShowCodeModal(false)}
          fetchOrders={fetchOrders}
          riderId={riderId}
          type={"dispatch"}
        />
      )}
    </div>
  );
};

export default DispatchCard;
