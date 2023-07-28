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


/**
 * @openapi
 * '/api/admin/dishes':
 *  get:
 *    tags:
 *    - Admin
 *    summary: Get all dishes
 *    "parameters":
 *        [  
 *          {  
 *             "name":"pageSize",
 *             "in":"query",
 *             "description":"The dishes number that needs to be fetched in one page.",
 *             "type":"string"
 *          }
 *        ] 
 *    responses:
 *      200:
 *        description: Get all dishes for the admin,
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
 *            $ref: '#/components/schemas/CreateDishInput'
 *    responses:
 *      200:
 *        description: Dish created
 *      401:
 *        description: Unauthorized
 */
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