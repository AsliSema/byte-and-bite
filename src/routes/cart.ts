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
 *             $ref: '#/components/schemas/Dish'
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
 *     summary: Clear user cart
 *     description: Clear the cart items of the user.
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
  .delete(protect, allowedTo(['customer']), clearCart);

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
  .put(protect, allowedTo(['customer']), updateCartItemQuantity);

export default router;
