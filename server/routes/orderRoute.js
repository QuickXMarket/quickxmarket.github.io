import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderPaystack, paystackWebhooks, getDeliveryFee } from '../controllers/orderController.js';

const orderRouter = express.Router();

// orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authUser, getAllOrders);
orderRouter.post('/paystack', authUser, placeOrderPaystack);
orderRouter.post('/delivery-fee', authUser, getDeliveryFee);

// Add webhook route for Paystack payment verification (no auth)
orderRouter.post('/paystack-webhook', paystackWebhooks);

export default orderRouter;
