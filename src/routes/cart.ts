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
 *     summary: Get Logged user cart
 *     description: Retrieve the logged-in user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with cart information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 numOfCartItems:
 *                   type: integer
 *                   description: Number of items in the cart.
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       '404':
 *         description: Cart not found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishID:
 *                 type: string
 *                 description: ID of the dish to be added to the cart.
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the dish to be added to the cart.
 *                 minimum: 1
 *     responses:
 *       '200':
 *         description: Successful response with updated cart information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Dish not found or invalid quantity.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '406':
 *         description: Dish quantity not available for this dish.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '422':
 *         description: Unable to add the dish to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

  .post(protect, allowedTo(['customer']), addDishToCart)

  /**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear logged user cart
 *     description: Clear the cart items of the logged-in user.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Cart cleared successfully.
 *       '404':
 *         description: Cart not found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dishID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the dish to be deleted from the cart.
 *     responses:
 *       '200':
 *         description: Successful response with updated cart information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Dish not found in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
  .delete(protect, allowedTo(['customer']), deleteDishFromCartItems)
  .put(protect, allowedTo(['customer']), updateCartItemQuantity);

export default router;
