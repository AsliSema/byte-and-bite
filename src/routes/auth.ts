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
 * /api/users/:
 *   get:
 *     summary: Get all users (admins only)
 *     description: Get a list of all users. This route is accessible to admins only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: number
 *                   description: The current page number.
 *                 pages:
 *                   type: number
 *                   description: The total number of pages.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.route("/").get(protect, allowedTo(["admin"]), getAllUsers);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

router.route("/:userID").put(protect, allowedTo(["customer", "cook"]), updateUser);

export default router;
