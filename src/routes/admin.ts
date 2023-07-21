import express from 'express';
import { updateUser } from '../controllers/admin';
import { createDish, deleteDish, updateDish } from '../controllers/dish';
import { allowedTo, protect } from '../middlewares/authMiddleware';
const {
    updateDishValidator,
    deleteDishValidator
  } = require('../utils/validators/dishValidator');

const router = express.Router();

router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);
router.route("/dishes").post(protect, allowedTo(['admin']), createDish);

router
    .put("/dishes/:id",protect, allowedTo(["admin"]), updateDishValidator, updateDish )
    .delete("/dishes/:id",protect, allowedTo(["admin"]), deleteDishValidator, deleteDish );

export default router;