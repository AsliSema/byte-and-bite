import { NextFunction, Request, Response } from "../types/express";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import Dish, {IDish} from "../models/dish";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";




/**
 * Create a new dish 
 * @route POST /api/dishes
 * @access Private/Cook
 */
const createDish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, cook, review, description, images, quantity, price, category, specificAllergies} = req.body as IDish;

    console.log(req.user)

    const newDish = await Dish.create({
        name, 
        cook: req.user?._id, 
        review, 
        description, 
        images, 
        quantity, 
        price, 
        category, 
        specificAllergies
    });

    if (newDish) {
        res.status(StatusCodes.CREATED).json({
            newDish
        });
    } else {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid dish data"))
    }

});

export {
    createDish
}