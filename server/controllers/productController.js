import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import { sendVendorProductUploadConfirmation } from "./mailController.js";

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

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData =
      typeof req.body.productData === "string"
        ? JSON.parse(req.body.productData)
        : req.body.productData;

    // Add vendorId from authenticated user
    const userId = req.body.userId;
    const vendor = await Vendor.findOne({ userId }).populate("userId");
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    let imagesUrl = [];

    if (req.files && req.files.length > 0) {
      // Handle formData files
      imagesUrl = await Promise.all(
        req.files.map(async (item, index) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            folder: `/Product Images/${vendor._id}`,
            public_id: `${productData.name
              .replace(/\s+/g, "_")
              .toLowerCase()}_${index + 1}`,
          });
          return result.secure_url;
        })
      );
    } else if (req.body.images && Array.isArray(req.body.images)) {
      // Handle base64 images in JSON
      imagesUrl = await Promise.all(
        req.body.images.map(async (base64String, index) => {
          const publicId = `${productData.name
            .replace(/\s+/g, "_")
            .toLowerCase()}_${index + 1}`;
          return await uploadBase64Image(
            base64String,
            `/Product Images/${vendor._id}`,
            publicId
          );
        })
      );
    }

    const product = await Product.create({
      ...productData,
      image: imagesUrl,
      vendorId: vendor._id,
    });

    // Update vendor's products array in Vendor document
    vendor.products.push(product._id);
    await vendor.save();

    if (vendor.userId && vendor.userId.email) {
      await sendVendorProductUploadConfirmation(vendor.userId.email, product);
    }

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get single Product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Product List by Vendor : /api/product/list/vendor
export const productListByVendor = async (req, res) => {
  try {
    // Fix: user id is in req.user._id (mongoose object)
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: vendor id missing" });
    }
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }
    const products = await Product.find({ vendorId: vendor._id });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
