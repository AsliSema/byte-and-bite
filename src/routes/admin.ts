import express from 'express';
import {
  updateUser,
  getAllUsers,
  getUserProfile,
  registerUser,
  deleteUser,
} from '../controllers/auth';
import {
  createDish,
  deleteDish,
  deleteReview,
  getAllDishes,
  updateDish,
} from '../controllers/dish';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order';
const {
  createDishValidator,
  updateDishValidator,
  deleteDishValidator,
  cookIdValidator,
} = require('../utils/validators/dishValidator');
const {
  signupValidator,
  updateUserValidator,
} = require('../utils/validators/authValidator');

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
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - phone
 *               - address
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Successful response with added user informations
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route('/users')
  .get(protect, allowedTo(['admin']), getAllUsers)
  .post(protect, allowedTo(['admin']), signupValidator, registerUser);

/**
 * @openapi
 * '/api/admin/users/{userID}':
 *  get:
 *     tags:
 *     - Admin
 *     summary: Get the user profile
 *     parameters:
 *      - name: userID
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
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
 *  delete:
 *     tags:
 *     - Admin
 *     summary: Delete the user
 *     parameters:
 *      - name: userID
 *        in: path
 *        description: The id of the user
 *        required: true
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

router
  .route('/users/:userID')
  .get(protect, allowedTo(['admin']), getUserProfile)
  .put(protect, allowedTo(['admin']), updateUserValidator, updateUser)
  .delete(protect, allowedTo(['admin']), deleteUser);

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
router
  .route('/dishes')
  .get(protect, allowedTo(['admin']), getAllDishes)
  .post(
    protect,
    allowedTo(['admin']),
    cookIdValidator,
    createDishValidator,
    createDish
  );

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
  .put(
    '/dishes/:id',
    protect,
    allowedTo(['admin']),
    updateDishValidator,
    updateDish
  )
  .delete(
    '/dishes/:id',
    protect,
    allowedTo(['admin']),
    deleteDishValidator,
    deleteDish
  );

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

router
  .route('/dish/review/:reviewID')
  .delete(protect, allowedTo(['admin']), deleteReview);

// Order

/**
 * @openapi
 * '/api/admin/order':
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
router.route('/order').get(protect, allowedTo(['admin']), getAllOrders);

/**
 * @swagger
 * /api/admin/order/{orderID}:
 *   get:
 *     summary: Get order by ID
 *     tags:
 *       - Admin
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
router
  .route('/order/:orderID')
  .get(protect, allowedTo(['admin']), getOrderById)

  /**
   * @swagger
   * /api/admin/order/{orderID}:
   *   put:
   *     summary: Update order status
   *     tags:
   *       - Admin
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
  .put(protect, allowedTo(['admin']), updateOrderStatus);

export default router;
