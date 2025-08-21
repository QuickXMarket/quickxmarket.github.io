import Admin from "../../models/Admin.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import Rider from "../../models/Rider.js";
import Wallet from "../../models/Wallet.js";
import Vendor from "../../models/Vendor.js";

export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const users = await User.find({})
      .select("name email _id createdAt isSeller isRider chatId")
      .lean();
    const vendors = await Vendor.find({})
      .select(
        "userId profilePhoto businessName address number products orders _id createdAt openingTime closingTime"
      )
      .lean();
    const riders = await Rider.find({}).lean();

    return res.status(200).json({ success: true, users, vendors, riders });
  } catch (error) {
    console.error("Error in getUsers API:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const orders = await Order.find({})
      .populate("items.product")
      .populate({
        path: "address",
        select: "firstName lastName email phone address",
      })
      .lean();

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in getOrders API:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const admin = await Admin.findById(userId);
    if (!admin) return res.status(403).json({ error: "Unauthorized" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const stats = {
      totalUsers: await User.countDocuments(),
      totalOrders: await Order.countDocuments(),
      todayOrders: await Order.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay },
      }),
      todayRevenue:
        (
          await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ])
        )[0]?.total || 0,
      totalRevenue:
        (
          await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ])
        )[0]?.total || 0,
    };

    const recentUsers = await User.find({}, { name: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const userActivities = recentUsers.map((user) => ({
      type: "user",
      id: user._id,
      name: user.name,
      createdAt: user.createdAt,
    }));

    const recentOrders = await Order.find({}, { createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const orderActivities = recentOrders.map((order) => ({
      type: "order",
      id: order._id,
      createdAt: order.createdAt,
    }));

    const wallets = await Wallet.find(
      { "transactions.0": { $exists: true } },
      { transactions: 1, userId: 1 }
    )
      .lean()
      .exec();

    const allTransactions = wallets.flatMap((wallet) =>
      wallet.transactions.map((tx) => ({
        type: "transaction",
        id: tx._id,
        userId: wallet.userId,
        createdAt: tx.createdAt,
      }))
    );

    const transactionActivities = allTransactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);

    const activities = [
      ...userActivities,
      ...orderActivities,
      ...transactionActivities,
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50);

    return res.status(200).json({
      success: true,
      data: {
        stats,
        activities,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats API:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
