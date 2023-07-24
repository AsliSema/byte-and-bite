import { NextFunction, Request, Response } from "../types/express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import Cart, { ICart } from "../models/cart";
import Order, { IOrder } from "../models/order";
import Dish from "../models/dish";
import User from "../models/user";

const calculateTotalInCart = async (cart: ICart) => {
    let totalPrice = 0;

    for (const item of cart.cartItems) {
        const currentDish = await Dish.findById(item.product);

        if (currentDish) {
            totalPrice += item.quantity * currentDish.price;
        }
    }

    return totalPrice;
};

const updateCartDishesQty = async (cart: ICart) => {
    for (const item of cart.cartItems) {
        const dish = await Dish.findById(item.product);
        if (dish) {
            dish.quantity -= item.quantity;
            if (dish.quantity <= 0) {
                dish.soldOut = true;
            }
            await dish?.save();
        }
    }
};

/**
 * Create Order 
 * @route POST /api/order/:cartID
 * @access Private customer
 */
const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findById(req.params.cartID);
    const user = await User.findById(req.user?._id)

    if (!cart) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, `Cart not found!`));
    }
    if (cart.user.toString() !== req.user?._id.toString()) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'You are not allowed to do this!'));
    }
    if (cart.cartItems.length === 0) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, `You have no items in the cart!`));
    }
    const deliveryFee = 0;
    const order = await Order.create({
        user: req.user?._id,
        cookId: cart.cookID,
        orderItems: cart.cartItems,
        deliveryFee,
        totalOrderPrice: await calculateTotalInCart(cart) + deliveryFee,
        deliveryAddress: `${user?.address.city}, ${user?.address.district}, ${user?.address.neighborhood}, ${user?.address.streetAddress}`
    })

    await updateCartDishesQty(cart);

    await Cart.findByIdAndDelete(cart._id);

    res.status(StatusCodes.CREATED).json({
        data: order
    })
})

/**
 * Get All Orders corresponding to the user role
 * @route GET /api/order, GET /api/admin/orders
 * @access Private customer, cook and admin
 */

const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    let count = 0;
    let orders;
    switch (userRole) {
        case 'admin':
            count = await Order.countDocuments();
            orders = await Order.find()
                .limit(pageSize)
                .skip(pageSize * (page - 1));
            break;
        case 'customer':
            count = await Order.countDocuments({ user: req.user?._id });
            orders = await Order.find({ user: req.user?._id })
                .limit(pageSize)
                .skip(pageSize * (page - 1));
            break;
        case 'cook':
            count = await Order.countDocuments({ cookId: req.user?._id });
            orders = await Order.find({ cookId: req.user?._id })
                .limit(pageSize)
                .skip(pageSize * (page - 1));
            break;
        default:
            return next(new ApiError(StatusCodes.BAD_REQUEST, `This ${userRole} role is not defined yet.`));
    }
    res.status(StatusCodes.OK).json({ orders, page, pages: Math.ceil(count / pageSize) });
})


/**
 * Get Order by ID (can't see other's orders) 
 * @route GET /api/order/:orderID, GET /api/admin/order/:orderID
 * @access Private customer, cook and admin
*/

const getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const orderID = req.params.orderID;
    let order = await Order.findById(orderID);

    switch (userRole) {
        case "customer":
            if (order?.user.toString() !== req.user?._id.toString()) {
                return next(new ApiError(StatusCodes.NOT_FOUND, `Not found!`));
            }
            break;
        case "cook":
            if (order?.cookId.toString() !== req.user?._id.toString()) {
                return next(new ApiError(StatusCodes.NOT_FOUND, `Not found!`));
            }
            break;
    }

    res.status(StatusCodes.OK).json({ order });
});

/**
 * An admin and cook route for changing order status and paid status
 * @route PUT /api/order/:orderID, PUT /api/admin/order/:orderID
 * @access Private cook and admin
*/

const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderID);

    if (!order) {
        return next(new ApiError(StatusCodes.NOT_FOUND, `There is no order associated with this id ${req.params.orderID}`));
    }

    if (req.user?.role !== 'admin' && order.cookId.toString() !== req.user?._id.toString()) {
        return next(new ApiError(StatusCodes.NOT_FOUND, `Not allowed to update this order`));
    }
    order.isDelivered = req.body.isDelivered;
    order.isPaid = req.body.isPaid;

    await order.save()
    res.status(StatusCodes.OK).json({ order });

});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
}