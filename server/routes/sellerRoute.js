import express from "express";
import {
  createVendor,
  editVendor,
  getVendorById,
  getVendorByUserId,
  sendRegisterRequest,
  toggleVendorStatus,
  vendorList,
} from "../controllers/vendorController.js";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";

const sellerRouter = express.Router();

sellerRouter.post(
  "/sendRegisterRequest",
  upload.single("profilePhoto"),
  authUser,
  sendRegisterRequest
);
sellerRouter.get("/user", authUser, getVendorByUserId);
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
