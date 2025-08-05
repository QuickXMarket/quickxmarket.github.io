import Vendor from "../models/Vendor.js";

// Create Vendor document after user fills SellerLogin form
import { v2 as cloudinary } from "cloudinary";
import { createWalletLogic } from "./walletController.js";

async function uploadBase64Image(base64String) {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload base64 image: " + error.message);
  }
}

export const createVendor = async (req, res) => {
  try {
    const {
      userId,
      businessName,
      number,
      address,
      latitude,
      longitude,
      openingTime,
      closingTime,
    } = req.body;

    if (
      !userId ||
      !businessName ||
      !number ||
      !address ||
      !latitude ||
      !longitude
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }
    // Check if vendor already exists for this user
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.json({ success: false, message: "Vendor already registered" });
    }

    let profilePhotoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      profilePhotoUrl = result.secure_url;
    } else if (
      req.body.profilePhoto &&
      req.body.profilePhoto.startsWith("data:image")
    ) {
      // Handle base64 profile photo
      profilePhotoUrl = await uploadBase64Image(req.body.profilePhoto);
    }

    const vendor = await Vendor.create({
      userId,
      profilePhoto: profilePhotoUrl,
      businessName,
      number,
      address,
      products: [],
      orders: [],
      latitude,
      longitude,
      openingTime,
      closingTime,
    });

    const walletResult = await createWalletLogic(userId, "vendor");
    if (!walletResult.success) {
      console.warn("Wallet not created:", walletResult.message);
    }

    return res.json({ success: true, vendor });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Toggle vendor status
export const toggleVendorStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }
    vendor.isOpen = !vendor.isOpen;
    await vendor.save();
    return res.json({
      success: true,
      message: `Vendor is now ${vendor.isOpen ? "open" : "closed"}`,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Get vendor by userId
export const getVendorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const vendor = await Vendor.findOne({ userId })
      .populate("products")
      .populate("orders");
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }
    return res.json({ success: true, vendor });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId)
      .populate("products")
      .populate("orders");
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }
    return res.json({ success: true, vendor });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const vendorList = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "businessName profilePhoto _id").sort(
      {
        businessName: 1,
      }
    );
    if (!vendors || vendors.length === 0) {
      return res.json({ success: false, message: "No vendors found" });
    }
    res.json({ success: true, vendors });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
