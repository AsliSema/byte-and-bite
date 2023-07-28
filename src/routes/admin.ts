import express from 'express';
import { updateUser,getAllUsers } from '../controllers/auth';
import { createDish, deleteDish, deleteReview, getAllDishes, updateDish } from '../controllers/dish';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/order';
const {
  updateDishValidator,
  deleteDishValidator
} = require('../utils/validators/dishValidator');

const router = express.Router();

// User
/**
 * @swagger
 * /api/admin/users/:
 *   get:
 *     summary: Get all users 
 *     description: Get a list of all users. This route is accessible to admins only.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: pageSize
 *         in: query
 *         description: Users number that needs to be fetched in one page
 *         type: number
 *       - name: pageNumber
 *         in: query
 *         description: The users page that needs to be fetched
 *         type: number
 *     responses:
 *       200:
 *         description: Successful response with the list of users.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden 
 */
router.route("/users").get(protect, allowedTo(["admin"]), getAllUsers);
router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);

// dish
router.route("/dishes")
  .get(protect, allowedTo(['admin']), getAllDishes)
  .post(protect, allowedTo(['admin']), createDish);
router
  .put("/dishes/:id", protect, allowedTo(["admin"]), updateDishValidator, updateDish)
  .delete("/dishes/:id", protect, allowedTo(["admin"]), deleteDishValidator, deleteDish);

// Review
router.route("/dish/review/:reviewID").delete(protect, allowedTo(['admin']), deleteReview);

// Order
router.route("/orders").get(protect, allowedTo(["admin"]), getAllOrders);
router.route("/order/:orderID")
  .get(protect, allowedTo(["admin"]), getOrderById)
  .put(protect, allowedTo(["admin"]), updateOrderStatus);

export default router;