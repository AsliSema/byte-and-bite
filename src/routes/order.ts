import express from "express";
import { protect, allowedTo } from "../middlewares/authMiddleware";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/order";

const router = express.Router();

router.route("/:cartID").post(protect, allowedTo(["customer"]), createOrder)
router.route("/").get(protect, allowedTo(["customer", "cook"]), getAllOrders);
router.route("/:orderID").get(protect, allowedTo(["customer", "cook"]), getOrderById);
router.route('/:orderID').put(protect, allowedTo(["cook"]), updateOrderStatus);

export default router;
