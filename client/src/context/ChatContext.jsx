import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseURL, axios } = useCoreContext();
  const { user, setUser } = useAuthContext();
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);

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
        if (newMessage.message.senderId === user._id) return;
        setMessages((prev) => [...prev, newMessage.message]);
      });
      socket.current.on("typing", ({ userId, name }) => {
        setTypingUsers((prev) => ({ ...prev, [userId]: name }));
      });

      socket.current.on("stop-typing", ({ userId }) => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      });

      retrieveMessages();

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, baseURL]);

  useEffect(() => {
    if (
      !socket.current ||
      !socket.current.connected ||
      !user ||
      !user.chatId ||
      !user._id
    )
      return;
    if (isTyping) {
      socket.current.emit("typing", {
        chatId: user.chatId,
        userId: user._id,
        name: user.name,
      });
    } else {
      socket.current.emit("stop-typing", {
        chatId: user.chatId,
        userId: user._id,
      });
    }
  }, [isTyping]);

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

        setMessages((prev) => [...prev, newMessage]);
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
    typingUsers,
    isTyping,
    setIsTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
