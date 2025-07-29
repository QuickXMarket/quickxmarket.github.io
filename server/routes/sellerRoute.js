import express from "express";
import {
  createVendor,
  getVendorById,
  getVendorByUserId,
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

sellerRouter.get("/vendor/:vendorId", authUser, getVendorById);

sellerRouter.get("/list", authUser, vendorList);

export default sellerRouter;
