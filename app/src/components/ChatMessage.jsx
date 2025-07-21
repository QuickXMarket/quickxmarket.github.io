import React, { useState } from "react";

const ChatMessage = ({ message, isSender }) => {
  const [showImage, setShowImage] = useState(false);

  const handleShow = () => setShowImage(true);
  const handleClose = () => setShowImage(false);

  const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i);
  const getVideoType = (url) => {
    const ext = url.split(".").pop();
    return `video/${ext}`;
  };

  return (
    <div className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[60%] rounded-2xl shadow p-2 ${
          isSender ? "bg-green-200 rounded-tr-none" : "bg-white rounded-tl-none"
        }`}
      >
        {/* Media Section */}
        {message.media && (
          <div onClick={handleShow} className="cursor-pointer mb-2">
            {isVideo(message.media) ? (
              <div className="relative">
                <video
                  src={message.media}
                  className="w-full h-auto object-cover rounded-lg"
                  muted
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ▶
                </div>
              </div>
            ) : (
              <img
                src={message.media}
                alt="sent"
                className="w-full max-w-xs rounded-lg"
              />
            )}
          </div>
        )}

        {/* Message Text */}
        {message.message && (
          <p className="text-gray-800 break-words whitespace-pre-wrap">
            {message.message}
          </p>
        )}

        {/* Timestamp */}
        <div className="text-right text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
            onClick={handleClose}
          >
            ✕
          </div>
          <div className="max-w-[90%] max-h-[90%]">
            {isVideo(message.media) ? (
              <video controls className="w-full h-full object-contain">
                <source
                  src={message.media}
                  type={getVideoType(message.media)}
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={message.media}
                alt="full view"
                className="w-full max-h-[90vh] object-contain rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
