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

router.route('/')

  /**
 * @openapi
 * /api/dish/:
 *   get:
 *     summary: Get All Dishes
 *     description: Retrieve dishes which related to the customer's location also the customer can filter by dish category<br>Retrieve dishes which related to the cook's ID<br>fetches just 10 dish if the user not logged in.
 *     tags:
 *       - Dish
 *     parameters:
 *       - name: category
 *         type: number
 *         in: query
 *         required: false
 *         description: To filter dishes by their category
 *       - name: pageSize
 *         in: query
 *         type: number
 *         required: false
 *         description: Results count to be fetched in one page
 *       - name: pageNumber
 *         type: number
 *         in: query
 *         required: false
 *         description: The dish page that needs to be fetched
 *     responses:
 *       '200':
 *         description: Successful response with an array of dishes and empty array of dishes if nothing found.
 */
  .get(getUser, getAllDishes)

  /**
   * @openapi
   * /api/dish:
   *   post:
   *     summary: Create a dish
   *     description: Create a dish (Cook Only)
   *     tags:
   *       - Dish
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Dish'
   *     responses:
   *       '200':
   *         description: Successful response with created dish information.
   *       '400':
   *         description: BAD_REQUEST for invalid dish data.
   *       '401':
   *         description: UNAUTHORIZED if the user is not logged in or his token is invalid.
   *       '403':
   *         description: FORBIDDEN. if the user is not a cook
   */
  .post(protect, allowedTo(['cook']), createDishValidator, createDish);

router
  .route('/:id')

  /**
 * @openapi
 * /api/dish/{dishID}:
 *   get:
 *     summary: Get a dish by ID
 *     description: Getting dish's info by it's ID
 *     tags:
 *       - Dish
 *     parameters:
 *       - name: dishID
 *         type: string
 *         in: path
 *         required: true
 *         defaul: 64b422e9cd4f0261704f3f38
 *         description: Dish ID to be fetched
 *     responses:
 *       '200':
 *         description: Successful response with an array of dishes and empty array of dishes if nothing found.
 *       '400':
 *         description: BAD_REQUEST if it's invalid ID
 *       '404':
 *         description: NOT_FOUND if the dish not found
 */
  .get(getDishValidator, getDishById)

  /**
   * @openapi
   * /api/dish/{dishID}:
   *   put:
   *     summary: Update Dish Data
   *     description: Update dish data (Cook Only).
   *     tags:
   *       - Dish
   *     parameters:
   *       - name: dishID
   *         in: path
   *         required: true
   *         default: 64b422e9cd4f0261704f3f38
   *         description: The ID of the dish to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Dish'
   *     responses:
   *       '200':
   *         description: Successful response with updated dish information.
   *       '400':
   *         description: BAD_REQUEST Dish not found or wrong dishID value.
   *       '401':
   *         description: UNAUTHORIZED if the user is not logged in or his token is invalid.
   *       '403':
   *         description: FORBIDDEN. if user is not a cook
   *       '404':
   *         description: NOT_FOUND if the dish not found.
   */
  .put(protect, allowedTo(['cook']), updateDishValidator, updateDish)

  /**
 * @openapi
 * /api/dish/{dishID}:
 *   delete:
 *     summary: Delete a dish by ID
 *     description: Delete a dish by it's ID
 *     tags:
 *       - Dish
 *     parameters:
 *       - name: dishID
 *         type: string
 *         in: path
 *         required: true
 *         description: Dish ID to be deleted
 *     responses:
 *       '200':
 *         description: Successful response with the deleted dish info.
 *       '400':
 *         description: BAD_REQUEST if it's invalid ID.
 *       '401':
 *         description: UNAUTHORIZED if the user is not logged in or his token is invalid.
 *       '403':
 *         description: FORBIDDEN if the user is not an admin or cook who own this dish
 *       '404':
 *         description: NOT_FOUND if the dish not found
 */
  .delete(protect, allowedTo(['admin', 'cook']), deleteDishValidator, deleteDish);

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
