import React, { useState, useEffect, useRef } from "react";
import SendIcon from "../assets/send.svg?react";
import PaperClipIcon from "../assets/paperclip.svg?react";
import ChatMessage from "../components/ChatMessage";
import { useCoreContext } from "../context/CoreContext";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";

const Contact = () => {
  const { messages, sendMessage, isTyping, setIsTyping, typingUsers } =
    useChatContext();
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
      let fileBase64 = null;
      if (selectedFile) {
        fileBase64 = await fileToBase64(selectedFile); // await is important
      }

      await sendMessage(newMessage.trim(), fileBase64);
      setNewMessage("");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            src={assets.QuickXMarket_Logo_Transparent}
            alt="log"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          {user && <p className="truncate w-20 sm:w-full">Hi! {user.name}</p>}
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col w-full max-w-screen bg-gray-100 ">
        {/* Header */}
        <div className=" flex items-center px-4 py-2 bg-white"></div>

        {/* Body */}
        <div className="flex flex-col flex-grow overflow-y-auto h-100  no-scrollbar">
          <div className="flex-grow px-4 py-2 bg-white overflow-y-auto flex flex-col-reverse">
            {Object.values(typingUsers).length > 0 && (
              <p className="text-sm text-gray-400 italic">
                {Object.values(typingUsers).join(", ")}{" "}
                {Object.values(typingUsers).length > 1 ? "are" : "is"} typing...
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

            <div ref={messagesEndRef} />
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
    </>
  );
};

export default Contact;
