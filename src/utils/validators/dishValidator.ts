// @ts-nocheck

import Review from '../../models/review';

const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const createDishValidator = [
  check('name').notEmpty().withMessage('Dish name is required'),

  check('description')
    .notEmpty()
    .withMessage('Dish description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Dish quantity is required')
    .isNumeric()
    .withMessage('Dish quantity must be a number')
    .custom((val) => {
      if (val < 0) {
        return Promise.reject(new Error('quantity must be greater than zero'));
      }
      return true;
    }),
  check('soldOut').optional(),
  check('price')
    .notEmpty()
    .withMessage('Dish price is required')
    .isNumeric()
    .withMessage('Dish price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price')
    .custom((val) => {
      if (val < 0) {
        return Promise.reject(new Error('quantity must be greater than zero'));
      }
      return true;
    }),
  check('images')
    .isArray({ min: 1 })
    .withMessage('images should be array of string with at least one image.'),

  validatorMiddleware,
];

const getDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

const updateDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

const deleteDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),

  validatorMiddleware,
];

const cookIdValidator = [
  check('cook').notEmpty().withMessage('cookID is required.').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

const createReviewValidator = [
  check('dishID').isMongoId().withMessage('Invalid ID format'),
  check('comment')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Max number of characters is 200 characters long'),
  check('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isNumeric()
    .withMessage('rating must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),

  validatorMiddleware,
];
const updateReviewValidator = [
  check('reviewID').isMongoId().withMessage('Invalid ID format'),
  check('comment')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Max number of characters is 200 characters long'),
  check('rating')
    .optional()
    .isNumeric()
    .withMessage('rating must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),

  validatorMiddleware,
];
const deleteReviewValidator = [
  check('reviewID')
    .isMongoId()
    .withMessage('Invalid ID format')
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review)
        return Promise.reject(
          new Error('There is no such review associated with this ID')
        );
      return true;
    }),

  validatorMiddleware,
];

export {
  createDishValidator,
  getDishValidator,
  updateDishValidator,
  deleteDishValidator,
  cookIdValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
