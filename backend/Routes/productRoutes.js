import express from "express";
const router = express.Router();
import { getproducts, getproductbyID, createProduct, updateProduct, deleteProduct, createProductReview,getTopProducts } from "../controllers/productcontroller.js";
import {protect, admin} from '../middleware/authMiddleware.js';
import  checkObjectId from '../middleware/checkObjectId.js'

router.route('/').get(getproducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id').get(checkObjectId, getproductbyID).put(protect, admin, checkObjectId, updateProduct).delete(protect, admin,checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
export default router;