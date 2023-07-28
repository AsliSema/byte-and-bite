import express from "express";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/order";

const router = express.Router();

/**
 * @swagger
 * /orders/{cartID}:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: cartID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the cart
 *     responses:
 *       200:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.route("/:cartID").post(protect, allowedTo(["customer"]), createOrder)

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.route("/").get(protect, allowedTo(["customer", "cook"]), getAllOrders);

/**
 * @swagger
 * /orders/{orderID}:
 *   get:
 *     summary: Get an order by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route("/:orderID").get(protect, allowedTo(["customer", "cook"]), getOrderById);

/**
 * @swagger
 * /orders/{orderID}:
 *   put:
 *     summary: Update order status
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route('/:orderID').put(protect, allowedTo(["cook"]), updateOrderStatus);

export default router;
