// @ts-nocheck

const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createDishValidator = [
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
  check('specificAllergies')
    .isArray()
    .withMessage('Must be a array of strings'),

  check('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('ratingsAverage must be a number')
    .isLength({ min: 1 })
    .withMessage('Rating must be above or equal 1.0')
    .isLength({ max: 5 })
    .withMessage('Rating must be below or equal 5.0'),
  check('ratingsQuantity')
    .optional()
    .isNumeric()
    .withMessage('ratingsQuantity must be a number'),

  validatorMiddleware,
];

exports.getDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteDishValidator = [
  check('id').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];
