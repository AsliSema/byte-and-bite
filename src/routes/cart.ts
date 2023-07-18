import express from 'express';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import { addDishToCart } from '../controllers/cart';

const router = express.Router();

router.route("/").post(protect,allowedTo(['customer']), addDishToCart);

export default router;