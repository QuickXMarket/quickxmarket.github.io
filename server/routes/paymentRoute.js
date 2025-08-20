import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  paystackWebhooks,
  placeDispatchPaystack,
  placeErrandPaystack,
  placeOrderPaystack,
  verifyPaystackTransaction,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack", authUser, placeOrderPaystack);
paymentRouter.post("/paystack-dispatch", authUser, placeDispatchPaystack);
paymentRouter.post("/paystack-errand", authUser, placeErrandPaystack);
paymentRouter.post("/paystack-webhook", paystackWebhooks);
paymentRouter.get("/verify/:reference", authUser, verifyPaystackTransaction);

export default paymentRouter;
