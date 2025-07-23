import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getDeliveryFee,
  getUserDispatch,
} from "../controllers/dispatchController.js";

const dispatchRouter = express.Router();

// dispatchRouter.post('/cod', authUser, placeOrderCOD);
dispatchRouter.get("/user", authUser, getUserDispatch);
// dispatchRouter.get("/rider/:riderId", authUser, getRiderOrders);
dispatchRouter.post("/delivery-fee", authUser, getDeliveryFee);
// dispatchRouter.patch("/update-status", authUser, updateOrderStatus);
// dispatchRouter.post("/accept", authUser, addRiderToOrder);
// dispatchRouter.post("/confirm-delivery", authUser, confirmDelivery);

export default dispatchRouter;
