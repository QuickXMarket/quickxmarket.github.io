import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getUserOrders,
  placeOrderPaystack,
  paystackWebhooks,
  getDeliveryFee,
  getVendorOrders,
  getRiderOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller/:vendorId", authUser, getVendorOrders);
orderRouter.get("/rider/:riderId", authUser, getRiderOrders);
orderRouter.post("/paystack", authUser, placeOrderPaystack);
orderRouter.post("/delivery-fee", authUser, getDeliveryFee);

orderRouter.post("/paystack-webhook", paystackWebhooks);

export default orderRouter;