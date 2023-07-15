import { NextFunction, Request, Response } from "../types/express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { config } from "../config/config";
import { ApiError } from "../utils/apiError";

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
                    401,
                    'You are not login, Please login to get access this route',
                )
            );
        }

        const decoded = jwt.verify(token, config.jwt.secret) as Decoded;

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
                new ApiError(
                    401,
                    'The user that belong to this token does no longer exist'
                )
            );
        }

        req.user = currentUser;
        next();
    }
);

export { protect };