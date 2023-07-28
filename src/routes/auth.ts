import express from 'express';
import { getAllUsers, getUserProfile, registerUser, signinUser, updateUser } from '../controllers/auth';
import { allowedTo, protect } from '../middlewares/authMiddleware';
const {
  signupValidator,
  signinValidator,
} = require('../utils/validators/authValidator');

const router = express.Router();

router.route('/signup').post(signupValidator, registerUser);
router.route('/signin').post(signinValidator, signinUser);
router.route('/profile').get(protect, getUserProfile);



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

router.route("/:userID").put(protect, allowedTo(["customer", "cook"]), updateUser);

export default router;
