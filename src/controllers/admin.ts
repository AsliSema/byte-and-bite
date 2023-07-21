import { NextFunction, Request, Response } from "../types/express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import User from "../models/user";

/**
 * Update User 
 * @route POST /api/admin/users/:userID
 * @access Private/admin
 */
const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const user = await User.findById(req.params.userID);

  if (user) {
    user.firstname = req.body.firstname || user.firstname;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.password = req.body.password || user.password;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive || user.isActive;
    user.address = req.body.address || user.address;

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
  } else {
    return next(new ApiError(StatusCodes.BAD_REQUEST, "User not found"))
  }
});


export {
  updateUser
}