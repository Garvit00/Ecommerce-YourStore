import express from "express";
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();
import {addOrderItems, getMyOrders, getOrderbyId, updateOrderToPaid,updateOrderToDelivered, getOrders} from "../controllers/orderController.js";
router.route('/').post(protect, addOrderItems).get(protect,admin,getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderbyId);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect,admin, updateOrderToDelivered);

export default router;