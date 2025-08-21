import Admin from "../../models/Admin.js";
import User from "../../models/User.js";
import Rider from "../../models/Rider.js";
import { createWalletLogic } from "../walletController.js";
import Vendor from "../../models/Vendor.js";
import RiderRequest from "../../models/RiderRequest";
import VendorRequest from "../../models/VendorRequest.js";
import { sendVendorRequestResponseNotif } from "../../mailTemplates/vendorRequest.js";
import RiderRequest from "../../models/RiderRequest.js";
import { sendRiderRequestResponseNotif } from "../../mailTemplates/riderRequest.js";

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
      const walletResult = await createWalletLogic(request.userId, "vendor");
      if (!walletResult.success) {
        console.warn("Wallet not created:", walletResult.message);
      }
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
      const walletResult = await createWalletLogic(request.userId, "rider");
      if (!walletResult.success) {
        console.warn("Wallet not created:", walletResult.message);
      }
    } else {
      request.requestStatus = "rejected";
    }

    request.adminRemarks = remarks;
    await request.save();

    if (approved) await RiderRequest.findByIdAndDelete(requestId);
    const user = await User.findById(request.userId).select("email");
    await sendRiderRequestResponseNotif(
      user.email,
      request.name,
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
