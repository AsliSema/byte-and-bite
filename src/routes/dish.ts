<<<<<<< Updated upstream
import express from "express";
import { createDish } from '../controllers/dish';
import { protect, allowedTo } from "../middlewares/authMiddleware";

const router = express.Router();

const { getAllDishes, getDishById } = require('../controllers/dish');

// Route 1: Get all dishes - /api/dish
router.get('/api/dish', getAllDishes);

// Route 2: Get dish by ID - /api/dish/:id
router.get('/api/dish/:id', getDishById);

router.route("/").post(protect, allowedTo(["cook"]), createDish)


export default router;
=======
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
>>>>>>> Stashed changes
