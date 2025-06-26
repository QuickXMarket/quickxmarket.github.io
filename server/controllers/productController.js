import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);

    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Add vendorId from authenticated user
    const userId = req.body.userId;
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const product = await Product.create({
      ...productData,
      image: imagesUrl,
      vendorId: vendor._id,
    });

    // Update vendor's products array in Vendor document
    vendor.products.push(product._id);
    await vendor.save();

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
    const vendorId = req.user?._id || req.body.userId;
    if (!vendorId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: vendor id missing" });
    }
    const products = await Product.find({ vendorId });
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
