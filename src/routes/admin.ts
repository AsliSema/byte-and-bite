import express from 'express';
import { updateUser } from '../controllers/admin';
import { createDish } from '../controllers/dish';
import { allowedTo, protect } from '../middlewares/authMiddleware';


const router = express.Router();

router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);
router.route("/dishes").post(protect, allowedTo(['admin']), createDish);


export default router;