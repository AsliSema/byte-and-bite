//@ts-nocheck
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/apiError';
import Cart from '../../models/cart';
import Order from '../../models/order';
import Dish from '../../models/dish';
import User from '../../models/user';
import { sendEmailOrder } from '../../utils/sendEmail';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../order'; 

jest.mock('../../models/cart');
jest.mock('../../models/order');
jest.mock('../../models/dish');
jest.mock('../../models/user');
jest.mock('../../utils/sendEmail');


  describe('createOrder', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: { cartID: 'cartID1' }, user: { _id: 'userID1', role: 'customer' }, body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should create a new order for the cart and return 201 status code', async () => {
      const mockCart = {
        _id: 'cartID1',
        user: 'userID1',
        cookID: 'cookID1',
        cartItems: [{ product: 'dishID1', quantity: 2 }],
      };

      const mockUser = {
        address: {
          city: 'City',
          district: 'District',
          neighborhood: 'Neighborhood',
          addressInfo: 'AddressInfo',
        },
      };

      const mockDish = {
        _id: 'dishID1',
        price: 100,
      };

      Cart.findById.mockResolvedValueOnce(mockCart);
      User.findById.mockResolvedValueOnce(mockUser);
      Dish.findById.mockResolvedValueOnce(mockDish);
      Order.create.mockResolvedValueOnce({ _id: 'orderID1' });

      await createOrder(req, res, next);

      expect(Order.create).toHaveBeenCalledWith(expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { _id: 'orderID1' } }));
    });

    it('should return 400 status code when the cart is not found', async () => {
      Cart.findById.mockResolvedValueOnce(null);

      await createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.BAD_REQUEST, 'Cart not found!')));
    });

    it('should return 400 status code when the cart does not belong to the user', async () => {
      const mockCart = { _id: 'cartID1', user: 'otherUserID' };

      Cart.findById.mockResolvedValueOnce(mockCart);

      await createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.BAD_REQUEST, 'You are not allowed to do this!')));
    });

    it('should return 400 status code when the cart is empty', async () => {
      const mockCart = { _id: 'cartID1', user: 'userID1', cartItems: [] };

      Cart.findById.mockResolvedValueOnce(mockCart);

      await createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.BAD_REQUEST, 'You have no items in the cart!')));
    });

    it('should return 500 status code when there is an error sending email', async () => {
      const mockCart = {
        _id: 'cartID1',
        user: 'userID1',
        cookID: 'cookID1',
        cartItems: [{ product: 'dishID1', quantity: 2 }],
      };

      const mockUser = {
        address: {
          city: 'City',
          district: 'District',
          neighborhood: 'Neighborhood',
          addressInfo: 'AddressInfo',
        },
      };

      const mockDish = {
        _id: 'dishID1',
        price: 100,
      };

      Cart.findById.mockResolvedValueOnce(mockCart);
      User.findById.mockResolvedValueOnce(mockUser);
      Dish.findById.mockResolvedValueOnce(mockDish);
      Order.create.mockResolvedValueOnce({ _id: 'orderID1' });

      sendEmailOrder.mockRejectedValueOnce(new Error('Email error'));

      await createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error : Email error'))
      );
    });
  });

  

  describe('getAllOrders', () => {
    let req: Request, res: Response, next: NextFunction;
  
    beforeEach(() => {
      req = { user: { _id: 'adminID1', role: 'admin' }, query: {} } as Request;
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as Response; // Set up mock for status() and json() methods
      next = jest.fn() as NextFunction;
    });
  
    it('should get all orders for admin user and return 200 status code', async () => {
      const pageSize = 10;
      const page = 1;
      const mockOrders = [
        { _id: 'orderID1' },
        { _id: 'orderID2' },
      ];
      const mockCount = mockOrders.length;
  
      // Mock the return values for Order.countDocuments and Order.find
      const countDocumentsMock = jest.fn().mockResolvedValueOnce(mockCount);
      const findMock = jest.fn().mockResolvedValueOnce(mockOrders);
      jest.spyOn(Order, 'countDocuments').mockImplementation(countDocumentsMock);
      jest.spyOn(Order, 'find').mockImplementation(findMock);
  
      // Set the query parameters
      req.query.pageSize = pageSize.toString();
      req.query.pageNumber = page.toString();
  
      // Call the controller function
      await getAllOrders(req, res, next);
      
    });

    it('should return 400 status code when user role is not defined', async () => {
      req.user.role = 'unknownRole';

      await getAllOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.BAD_REQUEST, 'This unknownRole role is not defined yet.')));
    });
  });

  describe('getOrderById', () => {
    let req, res, next;

    beforeEach(() => {
      req = { params: { orderID: 'orderID1' }, user: { _id: 'userID1', role: 'customer' } };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should get the order by ID for customer user and return 200 status code', async () => {
      const mockOrder = { _id: 'orderID1', user: 'userID1' };

      Order.findById.mockResolvedValueOnce(mockOrder);

      await getOrderById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it('should return 404 status code when the order does not belong to the user', async () => {
      const mockOrder = { _id: 'orderID1', user: 'otherUserID' };

      Order.findById.mockResolvedValueOnce(mockOrder);

      await getOrderById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!')));
    });
  });

 

  describe('updateOrderStatus', () => {
    let req: Request, res: Response, next: NextFunction;
    let statusMock: jest.Mock, jsonMock: jest.Mock;
  
    beforeEach(() => {
      req = { params: { orderID: 'orderID1' }, body: {}, user: { _id: 'cookID1', role: 'cook' } } as Request;
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn();
      res = { status: statusMock, json: jsonMock } as Response; // Set up mock for status() and json() methods
      next = jest.fn() as NextFunction;
    });
  
    it('should update the order status for cook user and return 200 status code', async () => {
      const mockOrder = {
        _id: 'orderID1',
        cookId: 'cookID1',
        isDelivered: false,
        isPaid: false,
        save: jest.fn().mockResolvedValueOnce({ _id: 'orderID1', cookId: 'cookID1', isDelivered: true, isPaid: false }),
      };
  
      // Mock the return value for Order.findById
      const findByIdMock = jest.fn().mockResolvedValueOnce(mockOrder);
      jest.spyOn(Order, 'findById').mockImplementation(findByIdMock);
  
      // Set the request body
      req.body.isDelivered = true;
  
      // Call the controller function
      await updateOrderStatus(req, res, next);
  
      // Ensure that Order.findById was called with the correct orderID
      expect(Order.findById).toHaveBeenCalledWith('orderID1');
  
      // Ensure that the order status was updated
      expect(mockOrder.isDelivered).toBe(true);
  
      // Ensure that order.save was called
      expect(mockOrder.save).toHaveBeenCalledTimes(1);
  
      // Ensure that the mock functions were called once
      expect(statusMock).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });
    it('should return 404 status code when the order does not exist', async () => {
      Order.findById.mockResolvedValueOnce(null);

      await updateOrderStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'Order not found!')));
    });

    it('should return 404 status code when the user is not allowed to update the order', async () => {
      const mockOrder = { _id: 'orderID1', cookId: 'otherUserID' };

      Order.findById.mockResolvedValueOnce(mockOrder);

      await updateOrderStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining(new ApiError(StatusCodes.NOT_FOUND, 'You are not allowed to do this!')));
    });
  });
