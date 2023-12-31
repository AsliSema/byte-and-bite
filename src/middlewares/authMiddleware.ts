import { NextFunction, Request, Response } from "../types/express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { config } from "../config/config";
import { ApiError } from "../utils/apiError";
import { StatusCodes } from "http-status-codes";


interface Decoded extends JwtPayload {
    id: string;
}


/**
 * Middleware used to protect routes from unauthorized users
 */
const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'You are not login, Please login to get access this route',
                )
            );
        }

        const decoded = jwt.verify(token, config.jwt.secret) as Decoded;

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new ApiError(
                    StatusCodes.UNAUTHORIZED,
                    'The user that belong to this token does no longer exist'
                )
            );
        }

        req.user = currentUser;
        next();
    }
);

const getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            req.user = undefined;
            next();
        }
        else {
            const decoded = jwt.verify(token, config.jwt.secret) as Decoded;

            const currentUser = await User.findById(decoded.id);

            if (!currentUser || !currentUser.address.city) {
                req.user = undefined;
                next();
            }
            else {
                req.user = currentUser;
                next();
            }

        }
    }
);

const allowedTo = (roles: ('admin' | 'cook' | 'customer')[]) => asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role as ('admin' | 'cook' | 'customer');
        if (!roles.includes(userRole)) {
            return next(
                new ApiError(
                    StatusCodes.FORBIDDEN,
                    'You are not authorized to do this.'
                )
            );
        }
        next();
    }
);






export { protect, allowedTo, getUser };