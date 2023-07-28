import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/order';

const router = express.Router();

/**
 * @openapi
 * '/api/order/{cartID}':
 *  post:
 *     tags:
 *     - /Order
 *     summary: Create an order.
 *     description: By given a cartID as a parameter, an order will be created.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cartID
 *         in: path
 *         description: The ID of the cart.
 *         required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateOrderResponse'
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal Server Error
 */

router.route('/:cartID').post(protect, allowedTo(['customer']), createOrder);
/**
 * @openapi
 * '/api/order':
 *  get:
 *     tags:
 *     - /Order
 *     summary: Get all orders
 *     description: Get all orders. Admins can get all ordersr, while customers and cooks can only get their own orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateOrderResponse'
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal Server Error
 */
router.route('/').get(protect, allowedTo(['customer', 'cook']), getAllOrders);
/**
 * @openapi
 * '/api/order/{orderId}':
 *  get:
 *     tags:
 *     - /Order
 *     summary: Get an order by ID
 *     description: search for an order by ID. Admins can get all ordersr by ID, while customers and cooks can only search (GET) their own order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The ID of the order.
 *         default: 64ba42dd98638643525b6d2e
 *         required: true
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateOrderResponse'
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found, There is no order id match the provided orderID.
 *      500:
 *        description: Internal Server Error
 */
router
  .route('/:orderID')
  .get(protect, allowedTo(['customer', 'cook']), getOrderById);

/**
 * @openapi
 * '/api/order/{orderId}':
 *   put:
 *     tags:
 *       - /Order
 *     summary: Update an order by ID
 *     description: Search for an order by ID and update isPaid & isDelivered. Cook can only access this API.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The ID of the order
 *         required: true
 *     requestBody:
 *       description: Updating value of isPaid & isDelivered. Cook can only access this API.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *                 description: ID of the dish to be added to the cart.
 *                 default: true
 *               isDelivered:
 *                 type: boolean
 *                 description: Quantity of the dish to be added to the cart.
 *                 default: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderResponse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not Found, There is no order ID matching the provided orderId.
 *       500:
 *         description: Internal Server Error
 */
router.route('/:orderID').put(protect, allowedTo(['cook']), updateOrderStatus);

export default router;
