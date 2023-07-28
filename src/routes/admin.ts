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
 *       - Admin
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

/**
 * @openapi
 * '/api/admin/users/{userID}':
 *  put:
 *     tags:
 *     - Admin
 *     summary: Update the user
 *     parameters:
 *      - name: userID
 *        in: path
 *        description: The id of the user
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);

// dish

/**
 * @openapi
 * '/api/admin/dishes':
 *  get:
 *    tags:
 *    - Admin
 *    summary: Get all dishes
 *    parameters:
 *     - name: pageSize
 *       in: query
 *       description: The dishes number that needs to be fetched in one page
 *       type: number
 *     - name: pageNumber
 *       in: query
 *       description: The dishes page that needs to be fetched
 *       type: number
 *    responses:
 *      200:
 *        description: Get all dishes
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *  post:
 *    tags:
 *    - Admin
 *    summary: Create a dish
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateDishInputForAdmin'
 *    responses:
 *      200:
 *        description: Dish created
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.route("/dishes")
  .get(protect, allowedTo(['admin']), getAllDishes)
  .post(protect, allowedTo(['admin']), createDish);

/**
 * @openapi
 * '/api/admin/dishes/{id}':
 *  put:
 *     tags:
 *     - Admin
 *     summary: Update the dish
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the dish
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Dish not found
 *  delete:
 *     tags:
 *     - Admin
 *     summary: Delete the dish
 *     parameters:
 *      - name: id
 *        in: path
 *        description: The id of the dish
 *        required: true
 *     responses:
 *       200:
 *         description: Dish deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Dish not found
 */

router
  .put("/dishes/:id", protect, allowedTo(["admin"]), updateDishValidator, updateDish)
  .delete("/dishes/:id", protect, allowedTo(["admin"]), deleteDishValidator, deleteDish);

// Review

/**
 * @openapi
 * '/api/admin/dish/review/{reviewID}':
 *  delete:
 *     tags:
 *     - Admin
 *     summary: Delete the review
 *     parameters:
 *      - name: reviewID
 *        in: path
 *        description: The id of the review
 *        required: true
 *     responses:
 *       200:
 *         description: Review deleted
 *       400:
 *         description: You can not delete this review!
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.route("/dish/review/:reviewID").delete(protect, allowedTo(['admin']), deleteReview);

// Order
router.route("/orders").get(protect, allowedTo(["admin"]), getAllOrders);
router.route("/order/:orderID")
  .get(protect, allowedTo(["admin"]), getOrderById)
  .put(protect, allowedTo(["admin"]), updateOrderStatus);

export default router;