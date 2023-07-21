import express from "express";
import { createDish, getAllDishes, getDishById, updateDish, deleteDish } from '../controllers/dish';
import { protect, allowedTo } from "../middlewares/authMiddleware";
import { createDishValidator, getDishValidator,updateDishValidator, deleteDishValidator } from '../utils/validators/dishValidator';

const router = express.Router();
router
  .route('/')
  .post(protect, allowedTo(['cook']), createDishValidator, createDish)
  .get(getAllDishes)

router
    .route('/:id')
    .get(getDishValidator, getDishById)
    .put(protect, allowedTo(["cook"]),updateDishValidator, updateDish)
    .delete(protect, allowedTo(["admin", "cook"]), deleteDishValidator, deleteDish);

export default router;
