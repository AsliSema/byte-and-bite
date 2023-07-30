import express from 'express';
import { getAllUsers, getUserProfile, registerUser, signinUser, updateUser } from '../controllers/auth';
import { allowedTo, protect } from '../middlewares/authMiddleware';
const {
  signupValidator,
  signinValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();


/**
 * @swagger
 * /api/users/signup
 *   post:
 *     summary: Register a new user
 *     tags: Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Bad request
 */

router.route('/signup').post(signupValidator, registerUser);
router.route('/signin').post(signinValidator, signinUser);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: User login
 *     tags: Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/signin', signinValidator, signinUser);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: User
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 */

router.route('/profile').get(protect, getUserProfile);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: User
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.route("/").get(protect, allowedTo(["admin"]), getAllUsers);
router.route("/:userID").put(protect, allowedTo(["customer", "cook"]), updateUser);

export default router;
