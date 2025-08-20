import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  assignRiderToErrand,
  confirmDelivery,
  getErrandDeliveryFee,
  getRiderErrand,
  getUserErrand,
  updateErrandStatus,
} from "../controllers/errandController.js";

const errandRouter = express.Router();

// errandRouter.post('/cod', authUser, placeOrderCOD);
errandRouter.get("/user", authUser, getUserErrand);
errandRouter.get("/rider/:riderId", authUser, getRiderErrand);
errandRouter.post("/delivery-fee", authUser, getErrandDeliveryFee);
errandRouter.patch("/update-status", authUser, updateErrandStatus);
errandRouter.post("/accept", authUser, assignRiderToErrand);
errandRouter.post("/confirm-delivery", authUser, confirmDelivery);

export default errandRouter;
