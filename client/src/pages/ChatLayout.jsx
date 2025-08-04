import React, { useState, useEffect, useRef } from "react";
import SendIcon from "../assets/send.svg?react";
import PaperClipIcon from "../assets/paperclip.svg?react";
import ChatMessage from "../components/ChatMessage";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";

const ChatLayout = () => {
  const {
    messages,
    sendMessage,
    isTyping,
    setIsTyping,
    typingUsers,
    setShowChatModal,
  } = useChatContext();
  const { user } = useAuthContext();
  const [groupedMessages, setGroupedMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const typingTimeoutRef = useRef(null);

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(msg);
      return acc;
    }, {});
  };

  const isVideo = (file) => {
    const videoFormats = ["video/mp4", "video/webm", "video/ogg", "video/mov"];
    const fileExtension = file.type;

    return videoFormats.some((format) => format.includes(fileExtension));
  };

  const onMessageInputChange = (value) => {
    setNewMessage(value);
    if (!isTyping) setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
    setGroupedMessages(groupMessagesByDate(messages));
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if ((!newMessage.trim() && !selectedFile) || sendingMessage) return;

    setSendingMessage(true);

    try {
      const content = newMessage.trim();
      const media = selectedFile;
      setNewMessage("");
      setSelectedFile(null);
      await sendMessage(content, media);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      <div className="md:hidden fixed inset-0 bg-black/30 z-40" />
      <div className="fixed bottom-6 right-0 md:bottom-4 md:right-4 w-full md:w-[360px] max-w-full z-50">
        <div className="rounded-t-xl md:rounded-xl shadow-lg bg-white flex flex-col h-[75vh] md:h-[75vh] border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
            <div className="font-medium">Customer Support</div>
            <button
              onClick={() => setShowChatModal(false)}
              className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-grow overflow-y-auto h-100  no-scrollbar">
            <div className="flex-grow px-4 py-2 bg-white overflow-y-auto flex flex-col-reverse">
              {" "}
              <div ref={messagesEndRef} />
              {Object.values(typingUsers).length > 0 && (
                <p className="text-sm text-gray-400 italic">
                  {Object.values(typingUsers).join(", ")}{" "}
                  {Object.values(typingUsers).length > 1 ? "are" : "is"}{" "}
                  typing...
                </p>
              )}
              {groupedMessages &&
                Object.entries(groupedMessages)
                  .reverse()
                  .map(([date, msgs]) => (
                    <div key={date}>
                      <div className="text-center my-3 text-sm font-semibold">
                        {date}
                      </div>
                      {msgs.map((msg) => (
                        <ChatMessage
                          key={msg.id}
                          message={msg}
                          currentUser={user?._id}
                        />
                      ))}
                    </div>
                  ))}
            </div>
          </div>

          {/* Footer */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center py-2 bg-white border-t px-1 sm:px-4"
          >
            <div className="flex items-center flex-grow bg-white border rounded-full px-3 py-2 shadow">
              <input
                type="text"
                className="flex-grow outline-none"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => onMessageInputChange(e.target.value)}
                onPaste={(e) => {
                  const items = e.clipboardData.items;
                  for (let i = 0; i < items.length; i++) {
                    if (
                      items[i].type.includes("image") ||
                      items[i].type.includes("video")
                    ) {
                      const file = items[i].getAsFile();
                      if (file) setSelectedFile(file);
                      break;
                    }
                  }
                }}
                disabled={sendingMessage}
              />

              {selectedFile && (
                <div className="relative ml-2">
                  {selectedFile.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      className="w-10 h-10 object-cover rounded"
                      alt="preview"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(selectedFile)}
                      className="w-10 h-10 object-cover rounded"
                      muted
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    onClick={() => setSelectedFile(null)}
                  >
                    &times;
                  </button>
                </div>
              )}

              <label htmlFor="file-upload" className="ml-3 cursor-pointer">
                <PaperClipIcon className="text-xl" />
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setSelectedFile(file);
                }}
                className="hidden"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={sendingMessage}
                className="ml-2 bg-primary hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center p-0 shadow-md"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
