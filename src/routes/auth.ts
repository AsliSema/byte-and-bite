import express from 'express';
import { getUserProfile, registerUser, signinUser } from '../controllers/auth';
import { protect } from '../middlewares/authMiddleware';
const {
  signupValidator,
  signinValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.route('/signup').post(signupValidator, registerUser);
router.route('/signin').post(signinValidator, signinUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
