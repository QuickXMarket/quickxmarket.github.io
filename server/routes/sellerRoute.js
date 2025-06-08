import express from 'express';
import { createVendor, getVendorByUserId } from '../controllers/vendorController.js';

const sellerRouter = express.Router();

// Route to create vendor document after SellerLogin form submission
sellerRouter.post('/register', createVendor);

// Route to get vendor by userId
sellerRouter.get('/:userId', getVendorByUserId);

export default sellerRouter;
