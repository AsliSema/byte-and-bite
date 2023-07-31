// @ts-nocheck
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const contactValidator = [
  check('fullName').notEmpty().withMessage('Full Name is required'),

  check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address format'),

  check('phone').optional().isMobilePhone(['tr-TR']).withMessage('Invalid phone number only accept Turkish phone numbers'),

  check('message')
    .notEmpty()
    .withMessage('message is required')
    .isLength({ max: 300 })
    .withMessage('Too long message, maximum allowed characters are 300 characters'),

  validatorMiddleware,
];

export { contactValidator };
