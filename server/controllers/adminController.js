import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Rider from "../models/Rider.js";
import Wallet from "../models/Wallet.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isEmailDomainValid } from "../utils/emailValidation.js";
import Chat from "../models/Chat.js";
import VendorRequest from "../models/VendorRequest.js";
import { sendVendorRequestResponseNotif } from "./mailController.js";
import RiderRequest from "../models/RiderRequest.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, number, email, password } = req.body;

    if (!name || !number || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const isValidDomain = await isEmailDomainValid(email, true);
    if (!isValidDomain) {
      return res.json({ success: false, message: "Invalid email domain." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      number,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        number: admin.number,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const isValidDomain = await isEmailDomainValid(email, true);
    if (!isValidDomain) {
      return res.json({
        success: false,
        message: "Invalid email domain.",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        number: admin.number,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isAuth = async (req, res) => {
  try {
    const { userId } = req.body;

    const admin = await Admin.findById(userId).select("-password");
    return res.json({ success: true, admin });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

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

export const updateUserFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.json({
        success: false,
        message: "Missing userId or fcmToken",
      });
    }

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    admin.fcmToken = fcmToken;
    await admin.save();

    return res.json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorRequests = async (req, res) => {
  try {
    const { userId } = req.body;

    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const vendorRequests = await VendorRequest.find({}).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, vendorRequests });
  } catch (error) {
    console.error("Error in getVendorRequests API:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const vendorRequestResponse = async (req, res) => {
  try {
    const { userId, approved, requestId, remarks } = req.body;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const request = await VendorRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request Not Found" });
    }

    let vendor;

    if (approved) {
      request.requestStatus = "approved";

      vendor = await Vendor.create({
        userId: request.userId,
        profilePhoto: request.profilePhoto,
        businessName: request.businessName,
        number: request.number,
        address: request.address,
        products: [],
        orders: [],
        latitude: request.latitude,
        longitude: request.longitude,
        openingTime: request.openingTime,
        closingTime: request.closingTime,
      });
    } else {
      request.requestStatus = "rejected";
    }

    request.adminRemarks = remarks;
    await request.save();

    if (approved) await VendorRequest.findByIdAndDelete(requestId);
    const user = await User.findById(request.userId).select("email");
    await sendVendorRequestResponseNotif(
      user.email,
      request.businessName,
      approved,
      remarks
    );

    return res.status(200).json({
      success: true,
      message: `Vendor request ${
        approved ? "approved" : "rejected"
      } successfully`,
      vendor: approved ? vendor : null,
    });
  } catch (error) {
    console.error("Error responding to vendor request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getRiderRequests = async (req, res) => {
  try {
    const { userId } = req.body;

    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const riderRequests = await RiderRequest.find({}).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, riderRequests });
  } catch (error) {
    console.error("Error in getRiderrRequests API:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const riderRequestResponse = async (req, res) => {
  try {
    const { userId, approved, requestId, remarks } = req.body;

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const request = await RiderRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request Not Found" });
    }

    let rider;

    if (approved) {
      request.requestStatus = "approved";

      rider = await Rider.create({
        userId: request.userId,
        name: request.name,
        number: request.number,
        dob: request.dob,
        vehicleType: request.vehicleType,
      });
    } else {
      request.requestStatus = "rejected";
    }

    request.adminRemarks = remarks;
    await request.save();

    if (approved) await RiderRequest.findByIdAndDelete(requestId);
    const user = await User.findById(request.userId).select("email");
    await sendVendorRequestResponseNotif(
      user.email,
      request.businessName,
      approved,
      remarks
    );

    return res.status(200).json({
      success: true,
      message: `Rider request ${
        approved ? "approved" : "rejected"
      } successfully`,
      rider: approved ? rider : null,
    });
  } catch (error) {
    console.error("Error responding to rider request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
