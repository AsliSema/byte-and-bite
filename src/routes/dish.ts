import express from 'express';
import { createDish } from '../controllers/dish';
import { protect, allowedTo } from '../middlewares/authMiddleware';
const { createDishValidator } = require('../utils/validators/dishValidator');

const router = express.Router();

router
  .route('/')
  .post(protect, allowedTo(['cook']), createDishValidator, createDish);

export default router;
