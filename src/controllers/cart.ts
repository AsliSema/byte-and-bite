import { NextFunction, Request, Response } from '../types/express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/apiError';
import Cart, { ICart } from '../models/cart';
import Dish from '../models/dish';

export enum qtyState {
  less_than_zero = 1,
  reqQty_bigger = 2,
  availableToAdd = 3,
}

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

const checkQuantity = (
  requestedQuantity: number,
  availableQuantity: number
) => {
  if (requestedQuantity <= 0) {
    return qtyState.less_than_zero;
  }
  if (requestedQuantity > availableQuantity) {
    return qtyState.reqQty_bigger;
  }
  return qtyState.availableToAdd;
};

// ADD dish to the cart items if it exists, otherwise create a new cart.
// @route POST /api/cart
// @access Private/customer

const addDishToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { dishID, quantity } = req.body;
    if (req.user.address.city === undefined) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, `Please add your address info first!`));
    }
    const dish = await Dish.findById(dishID).populate('cook', ['address']);

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!dish) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, `Dish not found!`));
    }
    else {
      const cook = Object.assign(dish.cook);
      if (cook.address.city !== req.user.address.city) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, `You can not a dish from other city!`));
      }
      if (checkQuantity(quantity, dish.quantity) === qtyState.less_than_zero) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Quantity is not available for this dish!'
          )
        );
      }

      // no cart yet
      if (!cart) {
        if (checkQuantity(quantity, dish.quantity) === qtyState.reqQty_bigger) {
          return next(
            new ApiError(
              StatusCodes.BAD_REQUEST,
              'Quantity is not available for this dish!'
            )
          );
        }
        cart = await Cart.create({
          user: req.user?._id,
          cartItems: [
            {
              product: dishID,
              quantity,
            },
          ],
          cookID: dish.cook._id,
        });
      }
      // cart exists
      else {
        // check if dish exists in cart
        const dishInCart = cart?.cartItems.find((item) => item.product == dishID);
        if (dishInCart) {
          // quantity = checkQuantity()
          if (
            checkQuantity(dishInCart.quantity + quantity, dish.quantity) ===
            qtyState.reqQty_bigger
          ) {
            // return next(new ApiError(StatusCodes.NOT_ACCEPTABLE, `Quantity is not available for this dish!`))
            dishInCart.quantity = dish.quantity;
          } else {
            dishInCart.quantity += quantity;
          }
        } else if (cart.cookID === dish.cook._id.toString() || cart.cookID === null) {
          //We also need to checkQuantity inside here
          if (
            checkQuantity(req.body.quantity, dish.quantity) ===
            qtyState.reqQty_bigger
          ) {
            cart.cartItems.push({ product: dishID, quantity: dish.quantity });
            cart.cookID = dish.cook._id.toString();
          } else {
            cart.cartItems.push({ product: dishID, quantity });
            cart.cookID = dish.cook._id.toString();
          }
        } else {
          return next(
            new ApiError(
              StatusCodes.NOT_ACCEPTABLE,
              `You can not add the dishes from different cooks `
            )
          );
        }
      }

      cart.totalCartPrice = await calculateTotalInCart(cart);

      await cart.save();
      res.status(StatusCodes.OK).json({
        data: cart,
      });
    }
  }
);


// @desc  Delete dish inside the cart items
// @route DELETE /api/cart/:dishID
// @access Private/customer


const deleteDishFromCartItems = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user?._id });
    const dish = await Dish.findById(req.params.dishID);

    if (!dish) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, `Dish is not found!`));
    }
    if (!cart) {
      return next(new ApiError(StatusCodes.BAD_REQUEST, `Cart is not found!`));
    }

    const dishInCart = cart.cartItems.find(
      (item) => item.product.toString() === req.params.dishID
    );

    if (dishInCart && dishInCart.quantity === 1) {
      const indexOfDish = cart.cartItems.findIndex(
        (item) => item.product.toString() === req.params.dishID
      );
      cart.cartItems.splice(indexOfDish, 1);
      cart.totalCartPrice = cart.totalCartPrice - dish.price;
      if (cart.cartItems.length === 0) {
        cart.totalCartPrice = 0;
        cart.cookID = null;
      }
    } else if (dishInCart && dishInCart.quantity > 1) {
      dishInCart.quantity -= 1;
      cart.totalCartPrice = cart.totalCartPrice - dish.price;
    } else if (!dishInCart) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `Dish is not found inside the cart!`
        )
      );
    }

    await cart.save();
    res.status(StatusCodes.OK).send({
      data: cart,
    });
  }
);

// @desc       Get Logged user cart
// @route      GET   /api/cart
// @access     private/customer

const getLoggedUserCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      return next(
        new ApiError(
          StatusCodes.NOT_FOUND,
          `There is no cart for this user id : ${req.user?._id}`
        )
      );
    }
    res.status(StatusCodes.OK).json({
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

// @desc       Clear logged user cart
// @route      DELETE   /api/cart
// @access     private/customer

const deleteCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await Cart.findOneAndDelete({ user: req.user?._id });

    res.status(StatusCodes.NO_CONTENT).send();
  }
);

// @desc    Update specific cart item quantity
// @route   PUT /api/cart/:dishID
// @access  Private/Customer

const updateCartItemQuantity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity } = req.body;
    const dish = await Dish.findById(req.params.dishID);

    if (!dish)
      return next(new ApiError(StatusCodes.BAD_REQUEST, `Dish not found!`));

    const maxQuantity = dish.quantity;

    const cart = await Cart.findOne({ user: req?.user?._id });
    if (!cart) {
      return next(
        new ApiError(
          StatusCodes.NOT_FOUND,
          `There is no cart for user: ${req?.user?._id}`
        )
      );
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === req.params.dishID
    );
    if (itemIndex > -1 && quantity > 0 && quantity <= maxQuantity) {
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity = quantity;
      cart.cartItems[itemIndex] = cartItem;
    } else if (quantity <= 0 || quantity > maxQuantity) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          `Quantity must be more than 0 and less or equal to ${maxQuantity}, please provide a valid value.`
        )
      );
    } else {
      return next(
        new ApiError(
          StatusCodes.NOT_FOUND,
          `There is no dish for this id: ${req.params.itemId}`
        )
      );
    }

    cart.totalCartPrice = await calculateTotalInCart(cart);

    await cart.save();

    res.status(StatusCodes.OK).json({
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

export {
  addDishToCart,
  deleteDishFromCartItems,
  deleteCart,
  updateCartItemQuantity,
  getLoggedUserCart,
};
