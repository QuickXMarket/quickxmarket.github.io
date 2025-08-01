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

export const editProduct = async (req, res) => {
  try {
    const { productId, vendorId } = req.body;
    let productData =
      typeof req.body.productData === "string"
        ? JSON.parse(req.body.productData)
        : req.body.productData;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.vendorId.toString() !== vendor._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to edit this product" });
    }

    let imagesUrl = product.image;

    if (req.files && req.files.length > 0) {
      imagesUrl = await Promise.all(
        req.files.map(async (item, index) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            folder: `/Product Images/${vendor._id}`,
            public_id: `${productData.name
              .replace(/\s+/g, "_")
              .toLowerCase()}_${index + 1}`,
            overwrite: true,
          });
          return result.secure_url;
        })
      );
    } else if (req.body.images && Array.isArray(req.body.images)) {
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

    product.name = productData.name;
    product.description = productData.description;
    product.category = productData.category;
    product.price = productData.price;
    product.offerPrice = productData.offerPrice;
    product.image = imagesUrl;

    await product.save();

    res.json({ success: true, message: "Product updated" });
  } catch (error) {
    console.log("Edit Product Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId, vendorId } = req.body;

    if (!productId || !vendorId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing productId or vendorId" });
    }

    // Find vendor by authenticated vendorId
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const product = await Product.findOne({
      _id: productId,
      vendorId: vendor._id,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or unauthorized" });
    }
    if (product.image && Array.isArray(product.image)) {
      await Promise.all(
        product.image.map(async (url) => {
          try {
            const parts = url.split("/");
            const publicIdWithExtension = parts.slice(-1)[0];
            const folder = parts
              .slice(parts.indexOf("Product Images"))
              .join("/");

            const publicId = folder.replace(/\.[^/.]+$/, "");
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("Cloudinary delete error:", err.message);
          }
        })
      );
    }
    await Product.deleteOne({ _id: productId });

    vendor.products = vendor.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    await vendor.save();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ success: false, message: error.message });
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
