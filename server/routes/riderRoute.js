import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createRider,
  getRiderById,
  getRiderByUserId,
} from "../controllers/riderController.js";

const riderRouter = express.Router();

// Route to create vendor document after SellerLogin form submission
riderRouter.post("/register", createRider);

riderRouter.get("/user/", authUser, getRiderByUserId);

riderRouter.get("/:riderId", getRiderById);

export default riderRouter;
