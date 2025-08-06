import React from "react";

const AlertModal = ({ isOpen, onClose, title, message, image, button }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-lg relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        {/* Image */}
        {image && (
          <img
            src={image}
            alt="Promo"
            className="w-full h-48 object-contain rounded-t-xl"
          />
        )}

        <div className="p-6 text-center">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

          {/* Optional Message */}
          {message && <p className="text-gray-600 text-sm">{message}</p>}
          {button && button.label && (
            <button
              onClick={button.onClick}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition w-full"
            >
              {button.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
