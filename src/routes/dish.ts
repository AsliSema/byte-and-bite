import express from "express";
import { createDish, updateDish, deleteDish } from '../controllers/dish';
import { protect, allowedTo } from "../middlewares/authMiddleware";




const router = express.Router();

// Create a new dish
router.route("/").post(protect, allowedTo(["cook"]), createDish)

// Update a dish by ID (access: cook)
router.route("/:id").put(protect, allowedTo(["cook"]), updateDish);

// Delete a dish by ID (access: admin or cook)
router.route("/:id").delete(protect, allowedTo(["admin", "cook"]), deleteDish);

        
export default router;