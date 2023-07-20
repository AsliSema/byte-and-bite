import express from "express";
import { createDish, getAllDishes, getDishById, updateDish, deleteDish, deleteDishByAdmin } from '../controllers/dish';
import { protect, allowedTo } from "../middlewares/authMiddleware";
const { createDishValidator, getDishValidator,updateDishValidator, deleteDishValidator } = require('../utils/validators/dishValidator');



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
    
router.delete(
      "/admin/dishes/:id",protect, allowedTo(["admin"]),deleteDishByAdmin);

export default router;
