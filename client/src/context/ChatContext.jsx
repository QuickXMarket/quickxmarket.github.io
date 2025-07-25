import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseURL, axios } = useCoreContext();
  const { user, updateUser } = useAuthContext();

  const socket = useRef(null);
  const [messages, setMessages] = useState([]);

  const retrieveMessages = async () => {
    try {
      const { data } = await axios.get("/api/chat/get-chat/");

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
    if (baseURL) socket.current = io(baseURL);
    if (user && user.chatId && baseURL) {
      socket.current.emit("join-room", user.chatId);

      socket.current.on("receive-message", (newMessage) => {
        // if (newMessage.message.senderId === user._id) return;
        setMessages((prev) => [...prev, newMessage.message]);
      });

      retrieveMessages();

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, baseURL]);

  const sendMessage = async (content, media = "") => {
    try {
      const { data } = await axios.post("/api/chat/send", {
        message: content,
        attachment: { base64: media },
        chatId: user.chatId,
      });

      if (data.success) {
        const newMessage = data.chat.messages.slice(-1)[0];
        const newChatId = data.chat._id;

        if (!user.chatId) {
          setUser((user) => ({
            ...user,
            chatId: newChatId,
          }));

          socket.current.emit("join-room", newChatId);
        }

        socket.current.emit("send-message", {
          roomId: user.chatId || newChatId,
          message: newMessage,
        });
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
