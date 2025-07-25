import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useCoreContext } from "../../context/CoreContext";

const DeliveryCodeModal = ({
  orderId,
  onClose,
  fetchOrders,
  riderId,
  type,
}) => {
  const [deliveryCode, setDeliveryCode] = useState(["", "", "", ""]);
  const inputsRef = [useRef(), useRef(), useRef(), useRef()];
  const { makeRequest } = useCoreContext();

  const handleDeliveryCodeSubmit = async () => {
    const code = deliveryCode.join("");
    try {
      const data = makeRequest({
        url:
          type === "normal"
            ? "/api/order/confirm-delivery"
            : "/api/dispatch/confirm-delivery",
        method: "POST",
        data: { code, orderId, riderId },
      });
      if (data.success) {
        toast.success("Delivery confirmed successfully");
        onClose();
        setDeliveryCode(["", "", "", ""]);
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to confirm delivery.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0  bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Enter Delivery Code
        </h2>
        <div className="flex justify-between mb-4">
          {deliveryCode.map((digit, index) => (
            <input
              key={index}
              ref={inputsRef[index]}
              type="number"
              maxLength="1"
              value={digit}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d?$/.test(val)) return;

                const newCode = [...deliveryCode];
                newCode[index] = val;
                setDeliveryCode(newCode);

                if (val && index < 3) inputsRef[index + 1].current.focus();
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  !deliveryCode[index] &&
                  index > 0
                ) {
                  inputsRef[index - 1].current.focus();
                }
              }}
              className="w-12 h-12 text-xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <button
            onClick={() => onClose()}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (deliveryCode.every((digit) => digit)) {
                handleDeliveryCodeSubmit();
              } else {
                toast.error("Please enter all digits of the code.");
              }
            }}
            className="text-primary font-semibold hover:underline"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCodeModal;
