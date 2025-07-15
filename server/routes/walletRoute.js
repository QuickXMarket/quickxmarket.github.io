import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createWallet,
  creditWallet,
  getRiderWallet,
  getVendorWallet,
  withdrawalRequest,
} from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.post("/create", authUser, createWallet);
walletRouter.get("/rider", authUser, getRiderWallet);
walletRouter.get("/vendor", authUser, getVendorWallet);
walletRouter.post("/withdrawal-request", authUser, withdrawalRequest);
walletRouter.post("/credit", authUser, creditWallet);

export default walletRouter;
