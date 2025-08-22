import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getCompletedOrders,
  getRiderById,
  getRiderByUserId,
  sendRegisterRequest,
  updateRiderFcmToken,
} from "../controllers/riderController.js";
import { upload } from "../configs/multer.js";

const riderRouter = express.Router();

// Route to create vendor document after SellerLogin form submission
riderRouter.post(
  "/sendRegisterRequest",
  upload.single("profilePhoto"),
  authUser,
  sendRegisterRequest
);
riderRouter.get("/user/", authUser, getRiderByUserId);
riderRouter.get("/:riderId", authUser, getRiderById);
riderRouter.get("/completedOrders/:riderId", authUser, getCompletedOrders);
riderRouter.patch("/update-fcm-token", authUser, updateRiderFcmToken);

export default riderRouter;
