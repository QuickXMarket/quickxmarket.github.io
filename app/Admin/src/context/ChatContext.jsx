import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import { useCoreContext } from "./CoreContext";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { baseUrl, makeRequest } = useCoreContext();
  const { admin } = useAuthContext();
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState(null);

  const retrieveMessages = async () => {
    // try {
    //   const data = await makeRequest({
    //     url: `/api/chat/get-chat/`,
    //     method: "GET",
    //   });

    //   if (data.success && data.chat?.messages) {
    //     setMessages(data.chat.messages);
    //   } else {
    //     console.error(data.message || "Failed to fetch messages");
    //   }
    // } catch (error) {
    //   console.error("Error fetching messages:", error);
    // }
    if (!chatId) return;
    setMessages(chatList.find((chat) => chat._id === chatId)?.messages || []);
  };

  const getChatList = async () => {
    try {
      const data = await makeRequest({
        url: "/api/admin/chats",
        method: "GET",
      });

      if (data.success) {
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
    if (!socket.current || !socket.current.connected || !chatId || admin)
      return;
    if (isTyping) {
      socket.current.emit("typing", {
        chatId: chatId,
        userId: admin._id,
        name: admin.name,
      });
    } else {
      socket.current.emit("stop-typing", {
        chatId: chatId,
        userId: admin._id,
      });
    }
  }, [isTyping]);

  useEffect(() => {
    if (baseUrl) socket.current = io(baseUrl);
    if (admin && chatId) {
      socket.current.emit("join-room", chatId);

      socket.current.on("receive-message", (newMessage) => {
        if (newMessage.message.senderId === admin._id) return;
        setMessages((prev) => [...prev, newMessage.message]);
      });
      socket.current.on("typing", ({ userId, name }) => {
        if (userId === admin._id) return;
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
  }, [chatId, baseUrl]);

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
          chatId,
        },
      });

      if (response.success) {
        const newMessage = response.chat.messages.slice(-1)[0];

        socket.current.emit("send-message", {
          roomId: chatId,
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
    setChatId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
