import express from 'express';
import { createDish, getAllDishes, getDishById } from '../controllers/dish';
import { protect, allowedTo } from '../middlewares/authMiddleware';
const { createDishValidator, getDishValidator } = require('../utils/validators/dishValidator');

const router = express.Router();

router
  .route('/')
  .post(protect, allowedTo(['cook']), createDishValidator, createDish)
  .get(getAllDishes)

router.get('/:id',getDishValidator, getDishById);
export default router;
