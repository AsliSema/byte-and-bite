const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
import User from '../../models/user';

exports.signupValidator = [
  check('firstname')
    .notEmpty()
    .withMessage('firstname required')
    .isLength({ min: 3 })
    .withMessage('Too short firstname, +3 characters required'),

  check('lastname')
    .notEmpty()
    .withMessage('lastname required')
    .isLength({ min: 3 })
    .withMessage('Too short lastname, +3 characters required'),

  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email address format')
    .custom((val: String) =>
      User.findOne({ email: val }).then((user: any) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exist'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Please enter a password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),

  check('phone')
    .notEmpty()
    .withMessage('phone required')
    .isMobilePhone(['tr-TR'])
    .withMessage('Invalid phone number only accept Turkish phone numbers'),

  /*check('role').custom((val: String) => {
    if (val !== 'customer' && val !== 'admin' && val !== 'cook') {
      return Promise.reject(
        new Error('Users can be only (customers, cooks or admins)')
      );
    }
    return true;
  }),*/

  check('profileImg').optional(),
  check('address.city').notEmpty().withMessage('please enter a city'),
  check('address.district').optional(),
  check('address.neighborhood').optional(),
  check('address.streetAddress').optional(),

  validatorMiddleware,
];

exports.signinValidator = [
  check('email')
    .notEmpty()
    .withMessage('email required')
    .isEmail()
    .withMessage('Invalid email address format')
    .custom((val: String) =>
      User.findOne({ email: val }).then((user: any) => {
        if (!user) {
          return Promise.reject(
            new Error(
              `Propably there is no an account associated with this email: ${val}, please sign up first!`
            )
          );
        }
      })
    ),

  check('password').notEmpty().withMessage('Please enter a password'),

  validatorMiddleware,
];
