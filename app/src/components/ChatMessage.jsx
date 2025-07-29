import React, { useState } from "react";

const ChatMessage = ({ message, currentUser }) => {
  const [showImage, setShowImage] = useState(false);
  const isSender = message.senderId === currentUser;

  const handleShow = () => setShowImage(true);
  const handleClose = () => setShowImage(false);

  const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i);
  const getVideoType = (url) => {
    const ext = url.split(".").pop();
    return `video/${ext}`;
  };

  const MessageText = ({ messageText }) => {
    if (!messageText) return null;
    const urlRegex =
      /((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(\.[a-z]{2,})?(\/\S*)?)/gi;

    const processedText = messageText.replace(urlRegex, (match) => {
      const url = match.startsWith("http") ? match : `https://${match}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800">${match}</a>`;
    });

    return (
      <p
        class="break-words whitespace-pre-wrap text-gray-800 max-w-[100%]"
        dangerouslySetInnerHTML={{ __html: processedText }}
      />
    );
  };

  return (
    <div className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl shadow p-2 ${
          isSender ? "bg-primary rounded-tr-none" : "bg-white rounded-tl-none"
        }`}
      >
        {!isSender && (
          <p className="font-bold mb-[5px] text-text whitespace-nowrap overflow-hidden text-ellipsis no-underline">
            {message.senderName}
          </p>
        )}
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
                />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ▶
                </div>
              </div>
            ) : (
              <img
                src={message.media}
                alt="sent"
                className="w-full max-w-xs rounded-lg h-50"
              />
            )}
          </div>
        )}

        {/* Text + Timestamp wrapper */}
        <div
          className={`${
            !message.media ? "flex flex-wrap items-end gap-2" : "block"
          }`}
        >
          {/* Message Text */}
          {message.message && <MessageText messageText={message.message} />}

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-500 shrink-0 whitespace-nowrap ${
              !message.media ? "ml-auto " : "text-right"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
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
