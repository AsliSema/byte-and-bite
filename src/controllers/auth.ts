import { NextFunction, Request, Response } from '../types/express';
import asyncHandler from 'express-async-handler';
import User, { Address } from '../models/user';
import generateToken from '../utils/generateToken';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/apiError';
import bcrypt from 'bcrypt';

/**
 * Register a new user
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password, phone, address } =
      req.body as {
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
        password: string;
        address: Address;
      };

    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, `User already exists`));
    }

    const user = await User.create({
      firstname,
      lastname,
      phone,
      email,
      password,
      address,
    });

    if (user) {
      res.status(StatusCodes.CREATED).json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error('Invalid user data');
    }
  }
);

/**
 * Authenticate user and get token
 * @route POST /api/users/login
 * @access Public
 */
const signinUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      let oldTokens = user.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter((t) => {
          const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
          if (timeDiff < 86400) {
            return t;
          }
        });
      }
      await User.findByIdAndUpdate(user._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      });
      res.status(StatusCodes.OK).json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token,
      });
    } else {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `Incorrect password or Email address`
        )
      );
    }
  }
);

/**
 * Signout currently Logged User
 * @route POST /api/users/signout
 * @access Private (All authenticated user)
 */
const signOut = asyncHandler(
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, message: 'Authorization fail!' });
      }
      const tokens = req.user?.tokens;
      const newTokens = tokens?.filter((t) => t.token !== token);

      // @ts-ignore
      await User.findOneAndUpdate(req.user._id, { tokens: newTokens });
      res.json({ success: true, message: 'signed out successfully!' });
    }
  }
);

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);

    if (user) {
      res.json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
      });
    } else {
      return next(
        new ApiError(
          StatusCodes.NOT_FOUND,
          `Incorrect password or Email address`
        )
      );
    }
  }
);

/**
 * Get user profile
 * @route GET /api/users
 * @access Private admins only
 */
const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.countDocuments();
    const Users = await User.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ Users, page, pages: Math.ceil(count / pageSize) });
  }
);

export { registerUser, signinUser, getUserProfile, getAllUsers, signOut };
