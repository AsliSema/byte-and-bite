//@ts-nocheck
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from '../../types/express';
import  { IReview, Review } from '../../models/review';
import Order from '../../models/order';
import { ApiError } from '../../utils/apiError';
import { createReview, deleteReview, updateReview } from '../dish';

jest.mock('../../models/review');
jest.mock('../../models/order');
jest.mock('../../utils/apiError');
describe('Review controller Unit tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: {
          _id: 'user_id',
        },
        params: {
          dishID: 'dish_id',
        },
        body: {
          comment: 'Delicious!',
          rating: 5,
        },
      } as Request;
      res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as Response;
      next = jest.fn() as NextFunction;
    });

    test('should return error if user has not purchased the dish', async () => {
      const mockOrders = [
        {
          _id: 'order_id',
          user: 'user_id',
          orderItems: [
            { product: 'other_dish_id', isDelivered: true },
            { product: 'another_dish_id', isDelivered: false },
          ],
        },
      ];
      Order.find.mockResolvedValueOnce(mockOrders);

      await createReview(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });

    // test('should create a new review if the user has purchased the dish', async () => {
    //   const mockOrders = [
    //     {
    //       _id: 'order_id',
    //       user: 'user_id',
    //       orderItems: [
    //         { product: 'other_dish_id', isDelivered: true },
    //         { product: 'dish_id', isDelivered: true },
    //       ],
    //     },
    //   ];
    //   Order.find.mockResolvedValueOnce(mockOrders);

    //   const mockReviewData = {
    //     user: 'user_id',
    //     dish: 'dish_id',
    //     comment: 'Delicious!',
    //     rating: 5,
    //   };

    //   // Mock the create method of the Review model to resolve with the mockReviewData.
    //   Review.create.mockResolvedValueOnce(mockReviewData);

    //   await createReview(req, res, next);

    //   expect(Review.create).toHaveBeenCalledWith(mockReviewData);
    //   expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    //   expect(res.json).toHaveBeenCalledWith({ newReview: mockReviewData });
    // });

    test('should handle invalid review data', async () => {
      const mockOrders = [
        {
          _id: 'order_id',
          user: 'user_id',
          orderItems: [
            { product: 'other_dish_id', isDelivered: true },
            { product: 'dish_id', isDelivered: true },
          ],
        },
      ];
      Order.find.mockResolvedValueOnce(mockOrders);

      // Set an invalid rating (greater than the maximum allowed value)
      req.body.rating = 6;

      await createReview(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });
});





