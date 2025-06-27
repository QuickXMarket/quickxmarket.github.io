import express from "express";
import {
  createVendor,
  getVendorById,
  getVendorByUserId,
} from "../controllers/vendorController.js";
import { upload } from "../configs/multer.js";

const sellerRouter = express.Router();

// Route to create vendor document after SellerLogin form submission
sellerRouter.post("/register", upload.single("profilePhoto"), createVendor);

// Route to get vendor by userId
sellerRouter.get("/user/:userId", getVendorByUserId);

sellerRouter.get("/vendor/:vendorId", getVendorById);

export default sellerRouter;
