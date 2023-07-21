import express from 'express';
import { updateUser } from '../controllers/admin';
import { allowedTo, protect } from '../middlewares/authMiddleware';


const router = express.Router();

router.route('/users/:userID').put(protect, allowedTo(['admin']), updateUser);


export default router;