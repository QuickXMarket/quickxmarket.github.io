import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseUrl, makeRequest } = useCoreContext();
  const { user, updateUser } = useAuthContext();

  const socket = useRef(null);
  const [messages, setMessages] = useState([]);

  const retrieveMessages = async () => {
    try {
      const data = await makeRequest({
        url: `/api/chat/get-chat/`,
        method: "GET",
      });

      if (data.success && data.chat?.messages) {
        setMessages(data.chat.messages);
      } else {
        console.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (baseUrl) socket.current = io(baseUrl);
    if (user && user.chatId) {
      socket.current.emit("join-room", user.chatId);

      socket.current.on("receive-message", (newMessage) => {
        if (newMessage.message.senderId === user._id) return;
        setMessages((prev) => [...prev, newMessage.message]);
      });

      retrieveMessages();

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, baseUrl]);

  const sendMessage = async (content, media = "") => {
    try {
      const response = await makeRequest({
        url: "/api/chat/send",
        method: "POST",
        data: {
          message: content,
          attachment: { base64: media },
          chatId: user.chatId,
        },
      });

      if (response.success) {
        const newMessage = response.chat.messages.slice(-1)[0];
        const newChatId = response.chat._id;

        if (!user.chatId) {
          updateUser({ ...user, chatId: newChatId });
          socket.current.emit("join-room", newChatId);
        }

        socket.current.emit("send-message", {
          roomId: user.chatId || newChatId,
          message: newMessage,
        });
        
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const value = {
    messages,
    sendMessage,
    retrieveMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
