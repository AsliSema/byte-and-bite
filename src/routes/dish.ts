import express from "express";
import { createDish, getAllDishes, getDishById, updateDish, deleteDish, createReview, deleteReview, updateReview } from '../controllers/dish';
import { protect, allowedTo, getUser } from "../middlewares/authMiddleware";
import { createDishValidator, getDishValidator, updateDishValidator, deleteDishValidator } from '../utils/validators/dishValidator';

const router = express.Router();

router.route('/')
  .get(getUser, getAllDishes)
  .post(protect, allowedTo(['cook']), createDishValidator, createDish)

router.route('/:id')
  .get(getDishValidator, getDishById)
  .put(protect, allowedTo(["cook"]), updateDishValidator, updateDish)
  .delete(protect, allowedTo(["admin", "cook"]), deleteDishValidator, deleteDish);

router.route('/review/:dishID')
  .post(protect, allowedTo(["customer"]), createReview)

router.route('/review/:reviewID')
  .delete(protect, allowedTo(["customer"]), deleteReview)
  .put(protect, allowedTo(["customer"]), updateReview);

export default router;
