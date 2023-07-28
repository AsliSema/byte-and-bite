import express from 'express';
import {
  createDish,
  getAllDishes,
  getDishById,
  updateDish,
  deleteDish,
  createReview,
  deleteReview,
  updateReview,
} from '../controllers/dish';
import { protect, allowedTo, getUser } from '../middlewares/authMiddleware';
import {
  createDishValidator,
  getDishValidator,
  updateDishValidator,
  deleteDishValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from '../utils/validators/dishValidator';

const router = express.Router();

router
  .route('/')
  .get(getUser, getAllDishes)
  .post(protect, allowedTo(['cook']), createDishValidator, createDish);

router
  .route('/:id')
  .get(getDishValidator, getDishById)
  .put(protect, allowedTo(['cook']), updateDishValidator, updateDish)
  .delete(
    protect,
    allowedTo(['admin', 'cook']),
    deleteDishValidator,
    deleteDish
  );

/**
 * @openapi
 * '/api/dish/review/{dishID}':
 *   post:
 *     tags:
 *       - /dish/review
 *     summary: review a specified dish.
 *     description: Send a review after ordering that dish only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: dishID
 *         in: path
 *         description: The ID of the dish.
 *         default: 64b41fb2d28bfe76c2ee2b02
 *         required: true
 *     requestBody:
 *       description: sending comment and rating number. Customer can only access this API.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: comment string.
 *                 default: 'So yummy!! exceeded expectations!'
 *               rating:
 *                 type: number
 *                 description: rating number, must be between 1-5.
 *                 default: 4
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReviewResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal Server Error
 */
router
  .route('/review/:dishID')
  .post(protect, allowedTo(['customer']), createReviewValidator, createReview);

/**
 * @openapi
 * '/api/dish/review/{reviewID}':
 *   delete:
 *     tags:
 *       - /dish/review
 *     summary: Delete a specified review By ID.
 *     description: Delete a review if its exist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewID
 *         in: path
 *         description: The ID of the review.
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReviewResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal Server Error
 *   put:
 *     tags:
 *       - /dish/review
 *     summary: Update a specified review By ID.
 *     description: Update a review if its exist and belongs to logged in user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reviewID
 *         in: path
 *         description: The ID of the review.
 *         required: true
 *     requestBody:
 *       description: update comment and rating number. Customer can only access this API.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: comment string.
 *                 default: 'So Good!'
 *               rating:
 *                 type: number
 *                 description: rating number, must be between 1-5.
 *                 default: 5
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReviewResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal Server Error
 */
router
  .route('/review/:reviewID')
  .delete(protect, allowedTo(['customer']), deleteReviewValidator, deleteReview)
  .put(protect, allowedTo(['customer']), updateReviewValidator, updateReview);

export default router;
