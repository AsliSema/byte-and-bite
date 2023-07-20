import express from 'express';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import {
  addDishToCart,
  clearCart,
  deleteDishFromCartItems,
  getLoggedUserCart,
  updateCartItemQuantity,
} from '../controllers/cart';

const router = express.Router();

router
  .route('/')
  .get(protect, allowedTo(['customer']), getLoggedUserCart)
  .post(protect, allowedTo(['customer']), addDishToCart)
  .delete(protect, allowedTo(['customer']), clearCart);

router
  .route('/:dishID')
  .delete(protect, allowedTo(['customer']), deleteDishFromCartItems)
  .put(protect, allowedTo(['customer']), updateCartItemQuantity);

export default router;
