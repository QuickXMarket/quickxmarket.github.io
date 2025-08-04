import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseURL, axios, fileToBase64 } = useCoreContext();
  const { user, setUser } = useAuthContext();
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const socket = useRef(null);
  const [messages, setMessages] = useState([]);

  const retrieveMessages = async () => {
    try {
      const { data } = await axios.get("/api/chat/get-chat/");

      if (data.success && data.chat?.messages) {
        setMessages(data.chat.messages.map((msg) => ({ ...msg, sent: true })));
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
      socket.current.emit("join-room", {
        roomId: user.chatId,
        userId: user._id,
      });

      socket.current.on("receive-message", (newMessage) => {
        if (newMessage.message.senderId === user._id) return;
        setMessages((prev) => [...prev, newMessage.message]);
      });
      socket.current.on("typing", ({ userId, name }) => {
        if (userId === user._id) return;
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

  const sendMessage = async (content, media) => {
    const tempId = `${Date.now()}-${Math.random()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: user._id,
      message: content,
      media: media,
      timestamp: new Date().toISOString(),
      sent: false,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const formData = new FormData();
      formData.append("message", content);
      formData.append("chatId", user.chatId);
      if (media) {
        formData.append("attachment", media); 
      }

      const { data } = await axios.post("/api/chat/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        const newMessage = {
          ...data.chat.messages.slice(-1)[0],
          sent: true,
        };

        const newChatId = data.chat._id;

        if (!user.chatId) {
          setUser((user) => ({
            ...user,
            chatId: newChatId,
          }));

          socket.current.emit("join-room", newChatId);
        }

        // Replace the temp message with the confirmed one
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempId ? newMessage : msg))
        );

        socket.current.emit("send-message", {
          roomId: user.chatId || newChatId,
          message: newMessage,
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally: mark the message as failed or remove it
    }
  };

  const value = {
    messages,
    sendMessage,
    retrieveMessages,
    typingUsers,
    isTyping,
    setIsTyping,
    showChatModal,
    setShowChatModal,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
