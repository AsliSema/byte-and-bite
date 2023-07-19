import express from 'express';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import { addDishToCart, deleteDishFromCartItems } from '../controllers/cart';

const router = express.Router();

router.route("/").post(protect,allowedTo(['customer']), addDishToCart);
router.route("/:dishID").delete(protect, allowedTo(['customer']), deleteDishFromCartItems);

export default router;