import express from "express";
import { createRider, getRiderById, getRiderByUserId } from "../controllers/riderController.js";

const riderRouter = express.Router();

// Route to create vendor document after SellerLogin form submission
riderRouter.post("/register", createRider);

riderRouter.get("/user/:userId", getRiderByUserId);

riderRouter.get("/vendor/:vendorId", getRiderById);

export default riderRouter;