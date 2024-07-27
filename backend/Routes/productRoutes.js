import express from "express";
const router = express.Router();
import { getproducts, getproductbyID } from "../controllers/productcontroller.js";

router.route('/').get(getproducts);
router.route('/:id').get(getproductbyID);

export default router;