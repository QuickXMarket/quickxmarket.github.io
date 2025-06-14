import Vendor from "../models/Vendor.js";

// Create Vendor document after user fills SellerLogin form
export const createVendor = async (req, res) => {
  try {
    const { userId, profilePhoto, businessName, number, address } = req.body;

    if (!userId || !businessName || !number || !address) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check if vendor already exists for this user
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.json({ success: false, message: "Vendor already registered" });
    }

    const vendor = await Vendor.create({
      userId,
      profilePhoto,
      businessName,
      number,
      address,
      products: [],
      orders: [],
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
    const vendor = await Vendor.findOne({ userId }).populate("products").populate("orders");
    if (!vendor) {
      return res.json({ success: false, message: "Vendor not found" });
    }
    return res.json({ success: true, vendor });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};
