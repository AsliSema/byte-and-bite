import express from 'express';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import {
  addDishToCart,
  clearCart,
  updateCartItemQuantity,
} from '../controllers/cart';

const router = express.Router();

router
  .route('/')
  .post(protect, allowedTo(['customer']), addDishToCart)
  .delete(protect, allowedTo(['customer']), clearCart);

router
  .route('/:dishID')
  .put(protect, allowedTo(['customer']), updateCartItemQuantity);

export default router;
