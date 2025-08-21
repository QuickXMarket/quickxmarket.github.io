import React, { useState } from "react";

const PinModal = ({ isOpen, onClose, state, setState }) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleKeyPress = async (value) => {
    if (value === "backspace") {
      setPin((prev) => prev.slice(0, -1));
    } else if (value === "enter") {
      if (pin.length === 4) {
        await handlePinSubmit(pin);
        setPin("");
      }
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + value);
      }
    }
  };

  const handlePinSubmit = async (pin) => {
    let data;
    if (state === "set" || state === "edit") {
      setConfirmPin(pin);
      setState((state) => (state === "set" ? "confirm" : "new"));
      setPin("");
      return;
    }
    if (state === "confirm" || state === "new") data.newPin = pin;
    if (state === "confirm") data.confirmPin = confirmPin;
    if (state === "new") data.currentPin = confirmPin;
    if (state === "enter") data.pin = pin;
    data.walletType = "rider";

    const route =
      state === "confirm"
        ? "createWalletPin"
        : state === "new"
        ? "editWalletPin"
        : "confirmWalletPin";

    try {
      const res = await makeRequest({
        url: `/api/wallet/${route}`,
        method: "POST",
        data,
      });

      if (res.success) {
        if (state !== "enter") toast.success(res.message);
        onClose();
      } else {
        toast.error(res.message || "Action failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-background w-full max-w-md rounded-t-2xl shadow-lg p-6 flex flex-col items-center pb-16">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">
          {state === "enter"
            ? "Enter"
            : state === "set"
            ? "Enter New"
            : "Confirm"}{" "}
          Pin
        </h2>

        {/* PIN Boxes */}
        <div className="flex gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-12 h-12 border-2 border-gray-500 rounded-lg flex items-center justify-center text-xl font-bold"
            >
              {pin[i] ? "•" : ""}
            </div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 w-full mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="py-4 bg-gray-300 rounded-lg text-xl font-bold active:bg-gray-200"
            >
              {num}
            </button>
          ))}

          {/* Backspace */}
          <button
            onClick={() => handleKeyPress("backspace")}
            className="py-4 bg-gray-300 rounded-lg text-xl font-bold active:bg-gray-200"
          >
            ←
          </button>

          {/* 0 */}
          <button
            onClick={() => handleKeyPress("0")}
            className="py-4 bg-gray-300 rounded-lg text-xl font-bold active:bg-gray-200"
          >
            0
          </button>

          {/* Enter */}
          <button
            onClick={() => handleKeyPress("enter")}
            className="py-4 bg-primary text-white rounded-lg text-xl font-bold active:bg-primary/90"
          >
            ↵
          </button>
        </div>

        {/* Cancel Button */}
        {state === "edit" && (
          <button
            onClick={onClose}
            className="text-sm text-gray-500 mt-2 underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default PinModal;
