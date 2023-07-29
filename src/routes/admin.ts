import express from 'express';
import { updateUser } from '../controllers/auth';
import { createDish, deleteDish, deleteReview, getAllDishes, updateDish } from '../controllers/dish';
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
router.route("/dishes")
  .get(protect, allowedTo(['admin']), getAllDishes)
  .post(protect, allowedTo(['admin']), createDish);
router
  .put("/dishes/:id", protect, allowedTo(["admin"]), updateDishValidator, updateDish)
  .delete("/dishes/:id", protect, allowedTo(["admin"]), deleteDishValidator, deleteDish);

// Review
router.route("/dish/review/:reviewID").delete(protect, allowedTo(['admin']), deleteReview);

// Order

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API endpoints for admin operations
 */

/**
 * @openapi
 * '/api/admin/orders':
 *  get:
 *    tags:
 *    - Admin
 *    summary: Get all orders by admin
 *    parameters:
 *     - name: pageSize
 *       in: query
 *       description: The number of orders that needs to be fetched in one page
 *       type: number
 *     - name: pageNumber
 *       in: query
 *       description: The page number of orders that needs to be fetched
 *       type: number
 *    responses:
 *      200:
 *        description: Get all orders successful
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */

router.route("/orders").get(protect, allowedTo(["admin"]), getAllOrders);


/**
 * @swagger
 * /order/{orderID}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
  router.route("/order/:orderID")
  .get(protect, allowedTo(["admin"]), getOrderById)
 
/**
 * @swagger
 * /order/{orderID}:
 *   put:
 *     summary: Update order status
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */ 
  .put(protect, allowedTo(["admin"]), updateOrderStatus);

export default router;