const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
import User from '../../models/user';
import { Request } from 'express';
import { isCityCode, getDistrictsByCityCode, getNeighbourhoodsByCityCodeAndDistrict } from "turkey-neighbourhoods";

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

  check('profileImg').optional(),

  check('address.city')
    .notEmpty().withMessage('please enter a city')
    .custom((val: string) => {
      const isCity = isCityCode(val);
      if (!isCity) {
        return Promise.reject(
          new Error("City not found!")
        );
      }
      return true
    }),

  check('address.district')
    .notEmpty().withMessage('please enter a district')
    .custom((val: string, { req }: { req: Request }) => {
      const districts = getDistrictsByCityCode(req.body.address.city);
      const isDistrict = districts.includes(val);
      if (!isDistrict) {
        return Promise.reject(
          new Error("District not found!")
        );
      }
      return true
    }),

  check('address.neighborhood')
    .notEmpty().withMessage('please enter a district')
    .custom((val: string, { req }: { req: Request }) => {
      const neighbourhoods = getNeighbourhoodsByCityCodeAndDistrict(req.body.address.city, req.body.address.district);
      const isNeighborhood = neighbourhoods.includes(val)
      if (!isNeighborhood) {
        return Promise.reject(
          new Error("Neighborhood not found!")
        );
      }
      return true
    }),

  check('address.addressInfo').notEmpty().withMessage('please enter a address info'),

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

exports.updateUserValidator = [
  check('firstname')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short firstname, +3 characters required'),

  check('lastname')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short lastname, +3 characters required'),

  check('email')
    .optional()
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
    .optional()
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),

  check('phone')
    .optional()
    .isMobilePhone(['tr-TR'])
    .withMessage('Invalid phone number only accept Turkish phone numbers'),

  check('profileImg').optional(),

  check('address.city')
    .optional()
    .custom((val: string) => {
      const isCity = isCityCode(val);
      if (!isCity) {
        return Promise.reject(
          new Error("City not found!")
        );
      }
      return true
    }),

  check('address.district')
    .optional()
    .custom((val: string, { req }: { req: Request }) => {
      const districts = getDistrictsByCityCode(req.body.address.city);
      const isDistrict = districts.includes(val);
      if (!isDistrict) {
        return Promise.reject(
          new Error("District not found!")
        );
      }
      return true
    }),

  check('address.neighborhood')
    .optional()
    .custom((val: string, { req }: { req: Request }) => {
      const neighbourhoods = getNeighbourhoodsByCityCodeAndDistrict(req.body.address.city, req.body.address.district);
      const isNeighborhood = neighbourhoods.includes(val)
      if (!isNeighborhood) {
        return Promise.reject(
          new Error("Neighborhood not found!")
        );
      }
      return true
    }),

  check('address.addressInfo')
    .optional(),

  validatorMiddleware,
];