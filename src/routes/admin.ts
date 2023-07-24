import express from 'express';
import { updateUser } from '../controllers/auth';
import { createDish, deleteDish, updateDish } from '../controllers/dish';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/order';
const {
  updateDishValidator,
  deleteDishValidator
} = require('../utils/validators/dishValidator');

const router = express.Router();

// User
router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);

// dish
router.route("/dishes").post(protect, allowedTo(['admin']), createDish);
router
  .put("/dishes/:id", protect, allowedTo(["admin"]), updateDishValidator, updateDish)
  .delete("/dishes/:id", protect, allowedTo(["admin"]), deleteDishValidator, deleteDish);

// Order
router.route("/orders").get(protect, allowedTo(["admin"]), getAllOrders);
router.route("/order/:orderID")
  .get(protect, allowedTo(["admin"]), getOrderById)
  .put(protect, allowedTo(["admin"]), updateOrderStatus);

export default router;