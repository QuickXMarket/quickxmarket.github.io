import React, { useState } from "react";
import toast from "react-hot-toast";
import DeliveryCodeModal from "./DeliveryCodeModal";
import { useCoreContext } from "../context/CoreContext";

const ErrandCard = ({ errand, riderId, fetchOrders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { makeRequest } = useCoreContext();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  const errandStatusActions = [
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
      if (errand.status === "Order Placed" && !errand.riderId) {
        const data = await makeRequest({
          url: `/api/errand/accept`,
          method: "POST",
          data: { errandId: errand._id, riderId },
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
            url: "/api/errand/update-status",
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
        {/* Errand ID & Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">
            Errand ID: {errand._id}
          </span>
          <span
            className={`text-xs font-semibold ${
              errand.isExpress ? "text-primary" : "text-gray-400"
            }`}
          >
            {errand.isExpress ? "Express" : "Standard"}
          </span>
        </div>

        {/* Dropoff Name & Phone */}
        <div className="mt-2 flex justify-between items-center gap-4 text-sm">
          <div className="flex-1">
            <p className="font-semibold text-gray-800">
              {errand.dropOff
                ? ` ${errand.dropOff.firstName} 
              ${errand.dropOff.lastName}`
                : `${errand.dropOffDetails.name}`}
            </p>
            <p className="text-xs text-gray-500">
              {errand.dropOff
                ? ` ${errand.dropOff.address}`
                : `${errand.dropOffDetails.address}`}
            </p>
          </div>
          <a
            href={`tel:${
              errand.dropOff
                ? errand.dropOff.phone
                : errand.dropOffDetails.phone
            }`}
            className="text-sm text-primary font-medium whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {errand.dropOff
              ? ` ${errand.dropOff.phone}`
              : `${errand.dropOffDetails.phone}`}
          </a>
        </div>

        {/* Status & Button */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-green-600 font-semibold">
            Status: {errand.status}
          </span>
          <button
            className="bg-primary text-white text-sm px-3 py-1 rounded hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation();
              handleBtnClick();
            }}
          >
            {}
            {errandStatusActions.find((a) => a.status === errand.status)
              ?.buttonText || "Update Status"}
          </button>
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="bg-background px-4 py-3 space-y-4 border-t border-gray-200 text-sm text-gray-700">
          {/* Errands Details */}
          <h3 className="mb-1">Errands Details</h3>
          {/* Errands List (replaces Delivery Note) */}
          {errand.errands && errand.errands.length > 0 && (
            <div className="space-y-3">
              {errand.errands.map((errand, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200"
                >
                  <p className="font-semibold text-gray-800">{errand.name}</p>
                  <p className="text-xs text-gray-500">{errand.address}</p>
                  {errand.phone && (
                    <a
                      href={`tel:${errand.phone}`}
                      className="text-sm text-primary font-medium block mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {errand.phone}
                    </a>
                  )}
                  {errand.deliveryNote && (
                    <p className="text-gray-700 mt-2">
                      <span className="font-medium text-gray-600">Note:</span>{" "}
                      {errand.deliveryNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showCodeModal && (
        <DeliveryCodeModal
          orderId={errand._id}
          onClose={() => setShowCodeModal(false)}
          fetchOrders={fetchOrders}
          riderId={riderId}
          type={"errand"}
        />
      )}
    </div>
  );
};

export default ErrandCard;
