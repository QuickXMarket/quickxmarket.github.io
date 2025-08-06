import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseUrl, makeRequest } = useCoreContext();
  const { admin, updateUser } = useAuthContext();
  const [user, setUser] = useState(null);
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [chatList, setChatList] = useState([]);

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

  const getChatList = async () => {
    try {
      console.log("Fetching chat list...");
      const data = await makeRequest({
        url: "/api/admin/chats",
        method: "GET",
      });

      if (data.success) {
        console.log("Chat list fetched successfully:", data.formattedChats);
        setChatList(data.formattedChats);
      } else {
        console.error(data.message || "Failed to fetch chats");
        setChatList([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChatList([]);
    }
  };

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

  useEffect(() => {
    if (baseUrl) socket.current = io(baseUrl);
    if (user && user.chatId) {
      socket.current.emit("join-room", user.chatId);

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
      getChatList();
      retrieveMessages();

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, baseUrl]);

  useEffect(() => {
    if (!admin) return;
    getChatList();
  }, [admin]);

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
    typingUsers,
    isTyping,
    setIsTyping,
    chatList,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
