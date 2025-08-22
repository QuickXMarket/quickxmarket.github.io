import Rider from "../models/Rider.js";
import Order from "../models/Order.js";
import Errand from "../models/Errand.js";
import Dispatch from "../models/Dispatch.js";
import { v2 as cloudinary } from "cloudinary";
import { encrypt } from "../utils/encryptText.js";
import RiderRequest from "../models/RiderRequest.js";
import { sendRiderRequestConfirmation } from "../mailTemplates/riderRequest.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

async function uploadBase64Image(base64String, folder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "image",
      folder,
      public_id: publicId,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload base64 image: " + error.message);
  }
}

export const sendRegisterRequest = async (req, res) => {
  try {
    const { userId, name, number, dob, vehicle, ninImage, profilePhoto } =
      req.body;

    if (
      !userId ||
      !name ||
      !number ||
      !dob ||
      !vehicle ||
      !ninImage ||
      !(profilePhoto && profilePhoto.startsWith("data:image"))
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existingRider = await Rider.findOne({ userId });
    if (existingRider) {
      return res.json({ success: false, message: "Rider already registered" });
    }
    const safeName = name.trim().replace(/\s+/g, "_");

    const ninImageUrl = await uploadBase64Image(
      ninImage,
      "Riders_NINImages",
      safeName
    );

    const profilePhotoUrl = await await uploadBase64Image(
      profilePhoto,
      "Riders_ProfilePhoto",
      safeName
    );
    const ninImageHash = encrypt(ninImageUrl);

    const riderRequest = await RiderRequest.create({
      userId,
      profilePhoto: profilePhotoUrl,
      name,
      number,
      dob,
      vehicleType: vehicle,
      ninImageHash,
    });

    const user = await User.findById(userId).select("email");
    const admins = await Admin.find().select("fcmToken notification");
    const adminFcmTokens = [];

    await Promise.all(
      admins.map(async (admin) => {
        if (!admin) return;

        if (admin.fcmToken) {
          adminFcmTokens.push(admin.fcmToken);
        }
        if (!Array.isArray(admin.notification)) {
          admin.notification = [];
        }
        admin.notification.push({
          title: "New Rider Registration Request",
          message: "A new rider has applied. Review the request.",
          type: "riderRequest",
          data: { id: riderRequest._id },
        });

        await admin.save();
      })
    );

    for (const token of adminFcmTokens) {
      try {
        await sendPushNotification(
          token,
          "New Rider Registration Request",
          `${riderRequest.name} has requested to join as a rider. Review their details in the dashboard.`,
          { route: `/rider-request/${riderRequest._id}` }
        );
      } catch (error) {
        console.error(
          "Error sending notification to token:",
          token,
          error.message
        );
      }
    }
    await sendRiderRequestConfirmation(user.email, name);

    res.json({ success: true, message: "Resquest has been sent" });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};
// Get rider by userId
export const getRiderByUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    const rider = await Rider.findOne({ userId }).select("-ninImageHash");

    if (!rider) {
      return res.json({ success: false, message: "Rider not found" });
    }
    return res.json({ success: true, rider });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getRiderById = async (req, res) => {
  try {
    const { riderId } = req.params;
    const rider = await Rider.findById(riderId).select("-ninImageHash");

    if (!rider) {
      return res.json({ success: false, message: "Rider not found" });
    }
    return res.json({ success: true, rider });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getCompletedOrders = async (req, res) => {
  try {
    const { riderId } = req.params;
    const orders = await Order.find({
      riderId,
      items: { $not: { $elemMatch: { status: { $ne: "Order Delivered" } } } },
    }).sort({ createdAt: -1 });

    const dispatchOrders = await Dispatch.find({
      riderId,
      status: "Order Delivered",
    }).sort({
      createdAt: -1,
    });

    const errands = await Errand.find({
      riderId,
      status: "Order Delivered",
    }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, errands, orders, dispatchOrders });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const updateRiderFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.json({
        success: false,
        message: "Missing userId or fcmToken",
      });
    }

    const rider = await Rider.findOne({ userId });
    if (!rider) {
      return res
        .status(404)
        .json({ success: false, message: "Rider not found" });
    }

    rider.fcmToken = fcmToken;
    await rider.save();

    return res.json({
      success: true,
      message: "FCM token updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
