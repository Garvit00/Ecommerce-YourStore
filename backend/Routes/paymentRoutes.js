import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { verifyPayment } from '../controllers/paymentController.js'; // Import the function from controller
import { createRazorpayOrder } from "../controllers/orderController.js";
const router = express.Router();
router.route('/verify').post(protect, verifyPayment);
router.route('/order').post(protect, createRazorpayOrder);
 
export default router;