import Admin from "../../models/Admin.js";
import Chat from "../../models/Chat.js";

export const getChatList = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const chats = await Chat.find({})
      .populate({
        path: "userId",
        select: "name email isOnline",
      })
      .select("lastUpdated userId messages")
      .lean()
      .sort({ lastUpdated: -1 });

    const formattedChats = chats.map((chat) => ({
      _id: chat._id,
      lastUpdated: chat.lastUpdated,
      user: {
        name: chat.userId?.name || "Unknown",
        email: chat.userId?.email || "Unknown",
        isOnline: chat.userId?.isOnline || false,
      },
      messages: chat.messages,
    }));

    return res.status(200).json({ success: true, formattedChats });
  } catch (err) {
    console.error("Error in getChats API:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
