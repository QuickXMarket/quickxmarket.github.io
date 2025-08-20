import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getRiderById,
  getRiderByUserId,
  sendRegisterRequest,
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

riderRouter.get("/:riderId", getRiderById);

export default riderRouter;
