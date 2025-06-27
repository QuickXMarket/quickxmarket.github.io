import Vendor from "../models/Vendor.js";

// Create Vendor document after user fills SellerLogin form
import { v2 as cloudinary } from "cloudinary";

export const createVendor = async (req, res) => {
  try {
    const { userId, businessName, number, address, latitude, longitude } =
      req.body;

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
    });

    return res.json({ success: true, vendor });
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
