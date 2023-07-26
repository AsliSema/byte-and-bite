import { NextFunction, Request, Response } from "../types/express";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import Dish, { IDish } from "../models/dish";
import Order from "../models/order";
import Review, { IReview } from "../models/review";
import { StatusCodes } from "http-status-codes";


const updateDishReviewsInfo = async (dishID: string) => {
    const dish = await Dish.findById(dishID);
    const dishReviews = await Review.find({ dish: dish?.id });
    const ratingsQuantity = dishReviews.length;
    let totalRating = 0;
    for (const review of dishReviews) {
        totalRating += review.rating;
    }
    const ratingsAverage = totalRating / ratingsQuantity;
    if (dish) {
        dish.ratingsAverage = ratingsAverage;
        dish.ratingsQuantity = ratingsQuantity;
        dish.save();
    }
}

/* Controller for getting all dishes 
    route: '/api/dish'
    access: puplic
*/

const getAllDishes = asyncHandler(async (req: Request, res: Response) => {
    // user not logged in
    if (!req.user) {
        const Dishes = await Dish.find()
            .limit(10);

        res.json({ Dishes });
    }
    // user logged in
    else {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.pageNumber) || 1;
        let count = 0;
        let dishes;
        if (req.user.role === 'admin') {
            count = await Dish.find().countDocuments();

            dishes = await Dish.find()
                .limit(pageSize)
                .skip(pageSize * (page - 1));

            res.json({ dishes, count: count, page, pages: Math.ceil(count / pageSize) });
        }
        else if (req.user.role === 'cook') {
            count = await Dish.find({
                cook: req.user._id
            }).countDocuments();

            dishes = await Dish.find({
                cook: req.user._id
            })
                .limit(pageSize)
                .skip(pageSize * (page - 1));

            res.json({ dishes, count: count, page, pages: Math.ceil(count / pageSize) });
        }
        else {
            if (req.query.category) {
                dishes = await Dish.find({
                    category: req.query.category,
                }).populate('cook', ['address'])
            }
            else {
                dishes = await Dish.find().populate('cook', ['address'])
            }

            let filteredDishes = dishes.filter((dish) => {
                const cook = Object.assign(dish.cook);
                return (cook.address.city === req?.user?.address.city && cook.address.district === req?.user?.address.district);
            });
            count = filteredDishes.length;
            filteredDishes = filteredDishes.slice(pageSize * (page - 1)).slice(0, pageSize);

            res.json({ dishes: filteredDishes, count: count, page, pages: Math.ceil(count / pageSize) });
        }

    }

});

/* Controller for getting a dish by ID
     route: '/api/dish/:id' 
     access: public 
*/
const getDishById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const dishId = req.params.id;
    const dishToFind = await Dish.findById(dishId);
    if (!dishToFind) {
        return next(new ApiError(StatusCodes.NOT_FOUND, "Dish not found"))
    }
    const dishReviews = await Review.find({ dish: dishId });
    const dish = { ...dishToFind.toObject(), reviews: dishReviews };
    res.status(StatusCodes.OK).json({ dish: dish });
});

/**
 * Create a new dish 
 * @route POST /api/dishes, POST /api/admin/dishes
 * @access Private/Cook, Private/admin
 */
const createDish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, cook, review, description, images, quantity, price, category, specificAllergies } = req.body as IDish;

    let cookID;
    if (req.user?.role === "admin") {
        cookID = req.body.cook
    } else {
        cookID = req.user?._id
    }

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

/**
 * Create a review for a dish
 * @route POST /api/dish/review/:dishID
 * @access Private Customer
 */
const createReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // get user orders
    const orders = await Order.find({ user: req.user?._id });
    // check if user has already purchased this dish
    let canReview = false;
    for (const order of orders) {
        for (const dish of order.orderItems) {
            if (dish.product.toString() === req.params.dishID && order.isDelivered === true) {
                canReview = true;
                break;
            }
        }
        if (canReview) {
            break;
        }
    }
    if (!canReview) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'You must buy this dish first!'))
    }
    const { comment, rating } = req.body as IReview;

    const newReview = await Review.create({
        user: req.user?._id,
        dish: req.params.dishID,
        comment,
        rating
    });

    updateDishReviewsInfo(req.params.dishID);
    if (!newReview) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid review data!'))
    }
    res.status(StatusCodes.CREATED).json({ newReview });
});


const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    let deletedReview;
    if (req.user?.role === 'admin') {
        deletedReview = await Review.findOneAndDelete({ _id: req.params.reviewID });
    }
    else {
        deletedReview = await Review.findOneAndDelete({
            $and: [
                { user: req.user?._id },
                { _id: req.params.reviewID },
            ],
        });
    }

    if (!deletedReview) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'You can not delete this review!'))
    }

    updateDishReviewsInfo(deletedReview.dish.toString());

    res.status(StatusCodes.OK).json({ deletedReview });
})


const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { comment, rating } = req.body;
    if ((rating !== undefined) && (rating < 1 || rating > 5 || typeof rating !== 'number')) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Rating must be between 1 and 5!'))
    }

    if ((comment !== undefined) && (typeof comment !== 'string' || comment === '' || comment === null)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Comment is required!'))
    }
    const updatedReview = await Review.findOneAndUpdate({
        $and: [
            { user: req.user?._id },
            { _id: req.params.reviewID },
        ],
    }, {
        rating,
        comment
    }, {
        new: true
    });

    if (!updatedReview) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'You can not update this review!'))
    }

    updateDishReviewsInfo(updatedReview.dish.toString());

    res.status(StatusCodes.OK).json({ updatedReview });
});


export {
    createDish,
    getAllDishes,
    getDishById,
    updateDish,
    deleteDish,
    createReview,
    deleteReview,
    updateReview
};
