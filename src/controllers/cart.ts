import { NextFunction, Request, Response } from "../types/express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import Cart from "../models/cart";
import Dish from "../models/dish";


export enum qtyState {
    less_than_zero = 1,
    reqQty_bigger = 2,
    availableToAdd = 3
}

const checkQuantity = (requestedQuantity: number, availableQuantity: number) => {
    if (requestedQuantity <= 0) {
        return qtyState.less_than_zero;
    }
    if(requestedQuantity > availableQuantity){
        return qtyState.reqQty_bigger;
    }
    return qtyState.availableToAdd;
}

// const calculateTotalInCart = (cart: ,dish) => {
//     let totalPrice = 0
//     cart.cartItems.forEach(item => {
//         totalPrice += (item.quantity*dish.price);
//     })
//     cart.totalCartPrice = totalPrice;
// }

const addDishToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { dishID, quantity } = req.body

    const dish = await Dish.findById(dishID)

    let cart = await Cart.findOne({user: req.user?._id})

    if(!dish){
        return next(new ApiError(StatusCodes.BAD_REQUEST, `Dish not found!`))
    }
    if (checkQuantity(quantity, dish.quantity) === qtyState.less_than_zero) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Quantity is not available for this dish!'));
    }
    
    // no cart yet
    if(!cart){
        if(checkQuantity(quantity, dish.quantity) === qtyState.reqQty_bigger) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, 'Quantity is not available for this dish!'));
        }
       cart = await Cart.create({
            user: req.user?._id,
            cartItems: [
                {
                    product: dishID,
                    quantity

                }
            ],
            cookID: dish.cook
        })
    }
    // cart exists
    else{
        // check if dish exists in cart
        const dishInCart = cart?.cartItems.find(item => item.product == dishID);
        if (dishInCart) {
            // quantity = checkQuantity()
            if (checkQuantity(dishInCart.quantity + quantity, dish.quantity ) === qtyState.reqQty_bigger) {
                // return next(new ApiError(StatusCodes.NOT_ACCEPTABLE, `Quantity is not available for this dish!`))
                dishInCart.quantity = dish.quantity;
            }
            else {
                dishInCart.quantity += quantity;
            }
        }
        else if (cart.cookID === dish.cook.toString()) {
            cart.cartItems.push({ product: dishID, quantity})
        }else{
            return next(new ApiError(StatusCodes.NOT_ACCEPTABLE, `You can not add the dishes from different cooks `))
        }
    }
    let totalPrice = 0
    cart.cartItems.forEach(item => {
        totalPrice += (item.quantity*dish.price);
    })
    cart.totalCartPrice = totalPrice;
    
    await cart.save()
    res.status(StatusCodes.OK).json({
        data: cart
    })
})

export {
    addDishToCart
}