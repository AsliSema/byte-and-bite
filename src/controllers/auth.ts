import { NextFunction, Request, Response } from "../types/express";
import asyncHandler from "express-async-handler";
import User, { Address, IUser } from "../models/user";
import Dish from "../models/dish";
import generateToken from '../utils/generateToken';
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/apiError";
import bcrypt from "bcrypt";

/**
 * Register a new user
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, password, phone, address } = req.body as {
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
        password: string;
        address: Address;

    };

    const userExists = await User.findOne({ email });

    if (userExists) {

        return next(new ApiError(StatusCodes.BAD_REQUEST, `User already exists`))
    }

    const user = await User.create({
        firstname,
        lastname,
        phone,
        email,
        password,
        address
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
        throw new Error("Invalid user data");
    }
});



/**
 * Authenticate user and get token
 * @route POST /api/users/login
 * @access Public
 */
const signinUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(StatusCodes.OK).json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            token: generateToken(user._id),
        });
    } else {
        return next(new ApiError(StatusCodes.BAD_REQUEST, `Incorrect password or Email address`))

    }
});

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let user;

    if (req.user?.role === "admin") {
        user = await User.findById(req.params.userID)
    } else {
        user = await User.findById(req.user?._id);
    }

    if(!user){
        return next(new ApiError(StatusCodes.NOT_FOUND, `User not found`))
    }

    res.status(StatusCodes.OK).json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
    });
});

/**
 * Get user profile
 * @route GET /api/users
 * @access Private admins only
 */
const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.countDocuments();
    const Users = await User.find()
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ Users, page, pages: Math.ceil(count / pageSize) });
});


/**
 * Update User 
 * @route POST /api/admin/users/:userID & /api/users/:userID
 * @access Private (admin) or (customer/cook who own this profile)
 */
const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, phone, profileImage, password, role, isActive, address } = req.body as IUser

    const user = await User.findById(req.params.userID);

    if (!user) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "User not found"))
    }
    if (req.user?.role !== "admin" && (req.user?._id.toString() !== user._id.toString())) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, "You are not allowed to do this!"))
    }
    if (req.user?.role === "admin") {
        user.isActive = isActive !== undefined ? isActive : user.isActive;
        user.role = role || user.role;
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profileImage = profileImage || user.profileImage;
    user.password = password || user.password;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.status(StatusCodes.OK).json({
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage,
        password: updatedUser.password,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        address: updatedUser.address
    });
});


/**
 * Delete User 
 * @route DELETE /api/admin/users/:userID & /api/users/:userID
 * @access Private (admin) or (customer/cook who want to delete himself/herself)
 */
const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let deletedUser;

    if(req.user?.role === "admin"){
        deletedUser = await User.findByIdAndDelete(req.params.userID)
    } else {
        deletedUser = await User.findByIdAndDelete(req.user?._id)
    }

    if (!deletedUser) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "User not found"))
    }

    if(deletedUser.role === "cook"){
        const relatedDishes = await Dish.deleteMany({cook: deletedUser._id})
    }

    res.status(StatusCodes.OK).json({
        message: 'User deleted',
        deletedUser: deletedUser 
    });
})

export {
    registerUser,
    signinUser,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser
};