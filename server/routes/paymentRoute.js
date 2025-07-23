import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  paystackWebhooks,
  placeDispatchPaystack,
  placeOrderPaystack,
  verifyPaystackTransaction,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack", authUser, placeOrderPaystack);
paymentRouter.post("/paystack-dispatch", authUser, placeDispatchPaystack);
paymentRouter.post("/paystack-webhook", paystackWebhooks);
paymentRouter.get("/verify/:reference", verifyPaystackTransaction);

export default paymentRouter;
