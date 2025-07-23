import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  paystackWebhooks,
  placeDispatchPaystack,
  placeOrderPaystack,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack", authUser, placeOrderPaystack);
paymentRouter.post("/paystack-dispatch", authUser, placeDispatchPaystack);
paymentRouter.post("/paystack-webhook", paystackWebhooks);

export default paymentRouter;
