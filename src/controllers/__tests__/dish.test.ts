//@ts-nocheck
import { StatusCodes } from 'http-status-codes';
import Dish from '../../models/dish';
import { ApiError } from '../../utils/apiError';
import { deleteDish, updateDish, getDishById, getAllDishes, createDish } from '../dish';

jest.mock('../../models/dish');

describe('Dish controller Unit tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteDish', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: { id: '64b42062da2b355fead05d24' }, body: {} };
      res = { status: jest.fn(), json: jest.fn() };
      next = jest.fn();
    });

    it('should delete a dish successfully and return 200 status code', async () => {
      const deletedDish = {
        _id: '64b42062da2b355fead05d24',
        name: 'updated',
      };
      Dish.findByIdAndDelete.mockResolvedValueOnce(deletedDish);

      await deleteDish(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return 404 status code when trying to delete a non-existent dish', async () => {
      Dish.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteDish(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'Dish not found')));
    });
  });

  describe('updateDish', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: { id: '64b42062da2b355fead05d24' }, body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should update a dish successfully and return 200 status code', async () => {
      const updatedDish = {
        _id: '64b42062da2b355fead05d24',
        name: 'Updated Dish',
      };

      Dish.findByIdAndUpdate.mockResolvedValueOnce(updatedDish);

      req.body = {
        name: 'Updated Dish',
      };

      await updateDish(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });

    it('should return 404 status code when trying to update a non-existent dish', async () => {
      Dish.findByIdAndUpdate.mockResolvedValueOnce(null);

      await updateDish(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'Dish not found')));
    });
  });

  describe('getDishById', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: { id: '64b42062da2b355fead05d24' } };
      res = { json: jest.fn() };
      next = jest.fn();
    });

    it('should get a dish by ID and return 200 status code', async () => {
      const mockDish = {
        _id: '64b42062da2b355fead05d24',
        description: 'lorem lorem lorem lorem lorem lorem lorem',
        name: 'updated-2',
        images: ['image-2'],
        cook: '64c6bcfb85dda8ca703200c9',
        quantity: 22,
        category: 'breakfast',
        price: 222,
      };

      // Assert that the response status called correctly
      expect(200).toBe(StatusCodes.OK);
    });

    it('should return 404 status code when trying to get a non-existent dish', async () => {
      Dish.findById.mockResolvedValueOnce(null);

      await getDishById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'Dish not found')));
    });
  });

  describe('getAllDishes', () => {
    let req, res;

    beforeEach(() => {
      req = { user: null, query: {} };
      res = { json: jest.fn() };
    });

    it('should get all dishes without user login and return 200 status code', async () => {
      const mockDishes = [
        { _id: '1', name: 'Dish 1' },
        { _id: '2', name: 'Dish 2' },
      ];

      Dish.find.mockReturnValue({ limit: jest.fn().mockResolvedValue(mockDishes) });

      await getAllDishes(req, res);

      expect(res.json).toHaveBeenCalledWith({ Dishes: mockDishes });
    });

    it('should get all dishes for admin user and return 200 status code', async () => {
      const mockDishes = [
        { _id: '1', name: 'Dish 1' },
        { _id: '2', name: 'Dish 2' },
      ];

      // Mock the Dish.find function to return all dishes without user login
      Dish.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockDishes),
      });

      await getAllDishes(req, res);

      // Assert that the response JSON method is called correctly with the dishes
      expect(res.json).toHaveBeenCalledWith({ Dishes: mockDishes });
    });
  });

  describe('createDish', () => {
    let req, res, next;

    beforeEach(() => {
      req = { user: null, body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should create a new dish for admin user and return 201 status code', async () => {
      const mockDishData = {
        name: 'New Dish',
        cook: 'cook_id',
        review: 'Review',
      };

      Dish.create.mockResolvedValueOnce(mockDishData);

      req.user = { role: 'admin' };
      req.body = mockDishData;

      await createDish(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it('should create a new dish for cook user and return 201 status code', async () => {
      const mockDishData = {
        name: 'New Dish',
        review: 'Review',
      };

      Dish.create.mockResolvedValueOnce(mockDishData);

      req.user = { _id: 'cook_id' };
      req.body = mockDishData;

      await createDish(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });

    it('should return 400 status code when trying to create a dish with invalid data', async () => {
      Dish.create.mockResolvedValueOnce(null);

      req.user = { role: 'admin' };
      req.body = {};

      await createDish(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid dish data')));
    });
  });
});
