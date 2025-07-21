import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getUserOrders,
  getDeliveryFee,
  getVendorOrders,
  getRiderOrders,
  updateOrderStatus,
  addRiderToOrder,
  confirmDelivery,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller/:vendorId", authUser, getVendorOrders);
orderRouter.get("/rider/:riderId", authUser, getRiderOrders);
orderRouter.post("/delivery-fee", authUser, getDeliveryFee);
orderRouter.patch("/update-status", authUser, updateOrderStatus);
orderRouter.post("/accept", authUser, addRiderToOrder);
orderRouter.post("/confirm-delivery", authUser, confirmDelivery);

export default orderRouter;
