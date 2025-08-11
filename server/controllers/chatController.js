import { v2 as cloudinary } from "cloudinary";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { sendPushNotification } from "../utils/fcmService.js";
import { sendNewMessageNotification } from "./mailController.js";
import Admin from "../models/Admin.js";

async function uploadBase64Image(base64String, folder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "image",
      folder,
      public_id: publicId,
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload base64 image: " + error.message);
  }
}

export const sendNewMessage = async (req, res) => {
  try {
    const { userId, message, chatId } = req.body;
    let mediaUrl = "";

    if (!userId) {
      return res.json({
        success: false,
        message: "Sender ID is required.",
      });
    }

    let chat = null;

    if (chatId) chat = await Chat.findById(chatId);
    if (!message && !req.file && !req.body.attachment?.base64) {
      return res.json({
        success: false,
        message: "Message content or attachment is required.",
      });
    }

    let sender = await User.findById(userId);
    if (!sender) {
      sender = await Admin.findById(userId);
    }

    if (!sender) {
      return res.json({
        success: false,
        message: "Sender not found.",
      });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: `/chat_media/${chatId}`,
        public_id: `${Date.now()}-${userId}`,
      });
      mediaUrl = result.secure_url;
    } else if (req.body.attachment?.base64?.startsWith("data:")) {
      mediaUrl = await uploadBase64Image(
        req.body.attachment.base64,
        `/chat_media/${chatId}`,
        `${Date.now()}-${userId}`
      );
    }

    const newMessage = {
      senderId: userId,
      senderName: sender.name,
      message,
      media: mediaUrl,
      timestamp: new Date(),
    };

    if (chat) {
      chat.messages.push(newMessage);
      chat.lastUpdated = new Date();
    } else {
      chat = new Chat({
        userId,
        messages: [newMessage],
      });
      if (sender) {
        sender.chatId = chat._id;
        await sender.save();
      }
    }

    await chat.save();

    res.json({ success: true, chat });
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    res.status(500).json({ success: false, message: "Failed to create chat." });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required.",
      });
    }

    const chat = await Chat.findOne({
      userId,
    });

    if (!chat) {
      return;
      //   res.status(404).json({ success: false, message: "Chat not found." });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat history." });
  }
};

export const notifyParticipants = async (chatId, senderId) => {
  try {
    const chat = await Chat.findById(chatId);
    const message = chat.messages[chat.messages.length - 1];
    const participants = [];
    if (senderId === chat.userId) {
    } else {
      const user = await User.findOne({ chatId, _id: { $ne: senderId } });
      if (user) {
        participants.push(user);
      }
    }
    for (const participant of participants) {
      if (participant.isOnline || participant.fcmToken) {
        if (participant.fcmToken) {
          await sendPushNotification(
            participant.fcmToken,
            "New Message",
            message?.text || "You have a new message",
            {
              chatId: chatId,
              senderId: senderId,
            }
          );
        }
      } else {
        await sendNewMessageNotification({
          recipientEmail: participant.email,
          senderName: participant.name,
          messageText: message.message,
          mediaUrl: message.media,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
