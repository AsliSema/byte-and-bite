import express from 'express';
import { getAllUsers, getUserProfile, registerUser, signinUser } from '../controllers/auth';
import { allowedTo, protect } from '../middlewares/authMiddleware';
const {
  signupValidator,
  signinValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.route('/signup').post(signupValidator, registerUser);
router.route('/signin').post(signinValidator, signinUser);
router.route('/profile').get(protect, getUserProfile);
router.route("/").get(protect, allowedTo(["admin"]), getAllUsers);

export default router;
