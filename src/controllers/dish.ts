import { NextFunction, Request, Response } from "../types/express";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import Dish, {IDish} from "../models/dish";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

/* Controller for getting all dishes 
    route: '/api/dish'
    access: puplic
*/

const getAllDishes = asyncHandler(async (req: Request, res: Response) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Dish.countDocuments();
    const Dishes = await Dish.find()
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ Dishes, page, pages: Math.ceil(count / pageSize) });
});
  
/* Controller for getting a dish by ID
     route: '/api/dish/:id' 
     access: public 
*/
const getDishById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dishId = req.params.id;
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return next(new ApiError(StatusCodes.NOT_FOUND, "Dish not found"))
    }

    res.status(StatusCodes.OK).json(dish);

  });

/**
 * Create a new dish 
 * @route POST /api/dishes, POST /api/admin/dishes
 * @access Private/Cook, Private/admin
 */
const createDish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, cook, review, description, images, quantity, price, category, specificAllergies} = req.body as IDish;

    let cookID;
    if(req.user?.role === "admin"){
        cookID = req.body.cook
    }else{
        cookID = req.user?._id
    } 

    console.log(req.user)

    const newDish = await Dish.create({
        name, 
        cook: cookID, 
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


/**
 * Update a dish by ID
 * @route PUT /api/dish/:id
 * @access Private/Cook
 */
const updateDish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dishId = req.params.id;
    const { name, review, description, images, quantity, price, category, specificAllergies, slug } = req.body as IDish;

    const updatedDish = await Dish.findByIdAndUpdate(dishId, {
        name,
        review,
        description,
        images,
        quantity,
        price,
        category,
        specificAllergies,
        slug
    }, { new: true });

    if (updatedDish) {
        res.status(StatusCodes.OK).json({
            updatedDish
        });
    } else {
        return next(new ApiError(StatusCodes.NOT_FOUND, "Dish not found"));
    }
});

/**
 * Delete a dish by ID
 * @route DELETE /api/dish/:id
 * @access Private/Admin,Cook
 */
const deleteDish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dishId = req.params.id;

    const deletedDish = await Dish.findByIdAndDelete(dishId);

    if (deletedDish) {
        res.status(StatusCodes.OK).json({
            deletedDish
        });
    } else {
        return next(new ApiError(StatusCodes.NOT_FOUND, "Dish not found"));
    }
});

export {
    createDish,
    getAllDishes,
    getDishById,
    updateDish,
    deleteDish
};
