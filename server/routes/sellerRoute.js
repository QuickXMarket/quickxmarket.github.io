import express from "express";
import {
  createVendor,
  editVendor,
  getVendorById,
  getVendorByUserId,
  toggleVendorStatus,
  vendorList,
} from "../controllers/vendorController.js";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";

const sellerRouter = express.Router();

sellerRouter.post(
  "/register",
  upload.single("profilePhoto"),
  authUser,
  createVendor
);
sellerRouter.get("/user/:userId", authUser, getVendorByUserId);
sellerRouter.patch(
  "/edit",
  upload.single("profilePhoto"),
  authUser,
  editVendor
);

sellerRouter.get("/vendor/:vendorId", authUser, getVendorById);

sellerRouter.get("/list", authUser, vendorList);
sellerRouter.patch("/toggle-status", authUser, toggleVendorStatus);

export default sellerRouter;
