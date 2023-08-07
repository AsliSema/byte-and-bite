import express from 'express';
import { getUserProfile, registerUser, signinUser, updateUser, deleteUser } from '../controllers/auth';
import { allowedTo, protect } from '../middlewares/authMiddleware';
const {
  signupValidator,
  signinValidator,
  updateUserValidator
} = require('../utils/validators/authValidator');

const router = express.Router();

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: 
 *      - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Bad request
 */

router.route('/signup').post(signupValidator, registerUser);

/**
 * @swagger
 * /api/users/signin:
 *   post:
 *     summary: User login
 *     tags: 
 *      - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Bad request
 */
router.route('/signin').post(signinValidator, signinUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: 
 *      - Users
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete user profile
 *     tags: 
 *      - Users
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */

router.route('/profile')
      .get(protect, getUserProfile)


/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user profile
 *     tags: 
 *      - Users
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */      
router.route('/')
      .delete(protect, deleteUser)


/**
 * @swagger
 * /api/users/{userID}:
 *   put:
 *     summary: Update user
 *     description: Update user profile information. Admins can update any user, while customers and cooks can only update their own profiles.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userID
 *         in: path
 *         description: The ID of the user to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successful response with the updated user data.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden 
 */

router.route("/:userID").put(protect, allowedTo(["customer", "cook"]), updateUserValidator, updateUser);

export default router;
