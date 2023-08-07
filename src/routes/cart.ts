import express from 'express';
import { allowedTo, protect } from '../middlewares/authMiddleware';
import {
  addDishToCart,
  deleteCart,
  deleteDishFromCartItems,
  getLoggedUserCart,
  updateCartItemQuantity,
} from '../controllers/cart';

const router = express.Router();

router
  .route('/')

  /**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     description: Retrieve the user's cart.
 *     tags:
 *       - Cart
 *     responses:
 *       '200':
 *         description: Successful response with cart information.
 *       '404':
 *         description: Cart not found for the user.
 */
  .get(protect, allowedTo(['customer']), getLoggedUserCart)

  /**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add dish to the cart
 *     description: Add a dish to the cart items of the logged-in user. If the cart does not exist, it will be created.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishID:
 *                 type: string
 *                 default: 64d0e5a8d6917c66a1491bda
 *               quantity:
 *                 type: number
 *                 default: 3
 *     responses:
 *       '200':
 *         description: Successful response with updated cart information.
 *       '400':
 *         description: Dish not found or invalid quantity.
 *       '401':
 *         description: UNAUTHORIZED.
 *       '403':
 *         description: FORBIDDEN.
 *       '406':
 *         description: NOT_ACCEPTABLE if the user added a dish from diffrent cook.
 */

  .post(protect, allowedTo(['customer']), addDishToCart)

  /**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Delete user cart
 *     description: Delete the cart items of the user.
 *     tags:
 *       - Cart
 *     responses:
 *       '204':
 *         description: Cart deleted successfully.
 *       '401':
 *         description: UNAUTHORIZED.
 *       '403':
 *         description: FORBIDDEN.
 */
  .delete(protect, allowedTo(['customer']), deleteCart);

router
  .route('/:dishID')

  /**
 * @swagger
 * /api/cart/{dishID}:
 *   delete:
 *     summary: Delete dish from cart
 *     description: Delete a specific dish from the cart items of the logged-in user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: dishID
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the dish to be deleted from the cart.
 *     responses:
 *       '200':
 *         description: Successful response with updated cart information.
 *       '400':
 *         description: Dish or Cart not found.
 *       '401':
 *         description: UNAUTHORIZED.
 *       '403':
 *         description: FORBIDDEN.
 */
  .delete(protect, allowedTo(['customer']), deleteDishFromCartItems)

  /**
   * @openapi
   * /api/cart/{dishID}:
   *   put:
   *     summary: Update cart item quantity
   *     description: Update dish quantity in cart.
   *     tags:
   *       - Cart
   *     parameters:
   *       - name: dishID
   *         in: path
   *         required: true
   *         description: The ID of the dish to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               quantity:
   *                  type: number
   *                  default: 1
   *                  description: in-cart dish quantity
   *     responses:
   *       '200':
   *         description: Successful response with updated cart information.
   *       '400':
   *         description: BAD_REQUEST Dish not found or wrong dishID value.
   *       '401':
   *         description: UNAUTHORIZED if the user is not logged in or his token is invalid.
   *       '403':
   *         description: FORBIDDEN. if the user is not a custoomer.
   *       '404':
   *         description: NOT_FOUND if the user doesn't have a cart yet.
   */
  .put(protect, allowedTo(['customer']), updateCartItemQuantity);

export default router;
