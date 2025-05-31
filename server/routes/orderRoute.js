import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderPaystack, paystackWebhooks } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/paystack', authUser, placeOrderPaystack)

// Add webhook route for Paystack payment verification (no auth)
orderRouter.post('/paystack-webhook', paystackWebhooks)

export default orderRouter;
