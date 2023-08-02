// order.test.ts

import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../../types/express';
import { ApiError } from '../../utils/apiError';
import Cart from '../../models/cart';
import Order from '../../models/order';
import Dish from '../../models/dish';
import User from '../../models/user';
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

describe('Order', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      // Mock cart data
      const mockCartId = 'cart_id_1';
      const mockUserId = 'user_id_1';
      const mockCart = {
        _id: mockCartId,
        user: mockUserId,
        cartItems: [{ product: 'product_id_1', quantity: 2 }],
        cookID: 'cook_id',
      };

      // Mock user data
      const mockUser = {
        _id: mockUserId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '5554567890',
        address: { city: '34', district: 'Üsküdar' },
      };

      // Mock Dish data
      const mockDish = {
        _id: 'product_id_1',
        price: 10,
      };

      // Mock create order response
      const mockOrder = {
        _id: 'order_id_1',
        user: mockUserId,
        cookId: 'cook_id',
        orderItems: [{ product: 'product_id_1', quantity: 2 }],
        deliveryFee: 0,
        totalOrderPrice: 20,
        deliveryAddress: 'City, District, Neighborhood, Address Info',
      };

      // Mock functions
      Cart.findById = jest.fn().mockResolvedValue(mockCart);
      User.findById = jest.fn().mockResolvedValue(mockUser);
      Dish.findById = jest.fn().mockResolvedValue(mockDish);
      Cart.findByIdAndDelete = jest.fn().mockResolvedValue(true);
      Order.create = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { cartID: mockCartId };
      mockReq.user = mockUser as any;

      // Call the controller function
      await createOrder(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Cart.findById).toHaveBeenCalledWith(mockCartId);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Dish.findById).toHaveBeenCalledWith('product_id_1');
      expect(Order.create).toHaveBeenCalledWith(mockOrder);
      expect(Cart.findByIdAndDelete).toHaveBeenCalledWith(mockCartId);
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockOrder });
    });

    it('should return an error if the cart does not exist', async () => {
      const mockCartId = 'non-existent-cart-id';
      const mockUserId = 'user_id';

      // Mock function to return null for Cart.findById
      Cart.findById = jest.fn().mockResolvedValue(null);

      // Mock request data
      mockReq.params = { cartID: mockCartId };
      mockReq.user = {
        _id: mockUserId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '5554567890',
        address: { city: '34', district: 'Üsküdar' },
      } as any;

      // Call the controller function
      await createOrder(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Cart.findById).toHaveBeenCalledWith(mockCartId);
      expect(Order.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders for admin user', async () => {
      // Mock user data with admin role
      const mockAdminUserId = 'admin_user_id';
      const mockUser = {
        _id: mockAdminUserId,
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        phone: '5551234567',
        role: 'admin',
        address: { city: '34', district: 'Üsküdar' },
      };

      // Mock order data
      const mockOrders = [
        { _id: 'order_id_1', user: 'user_id_1', orderItems: [], totalOrderPrice: 20 },
        { _id: 'order_id_2', user: 'user_id_2', orderItems: [], totalOrderPrice: 30 },
      ];

      // Mock function to return the orders for admin user
      Order.countDocuments = jest.fn().mockResolvedValue(mockOrders.length);
      Order.find = jest.fn().mockResolvedValue(mockOrders);

      // Mock request data
      mockReq.user = mockUser as any; // Use type assertion to provide the required properties.

      // Call the controller function
      await getAllOrders(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.countDocuments).toHaveBeenCalled();
      expect(Order.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        orders: mockOrders,
        page: 1,
        pages: 1, // Since pageSize is 10 and we have 2 orders, there will be only one page.
      });
    });

    it('should return all orders for customer user', async () => {
      // Mock user data with customer role
      const mockCustomerUserId = 'customer_user_id';
      const mockUser = {
        _id: mockCustomerUserId,
        firstname: 'Customer',
        lastname: 'User',
        email: 'customer@example.com',
        phone: '5559876543',
        role: 'customer',
        address: { city: '34', district: 'Üsküdar' },
      };

      // Mock order data
      const mockOrders = [
        { _id: 'order_id_1', user: 'user_id_1', orderItems: [], totalOrderPrice: 20 },
        { _id: 'order_id_2', user: 'user_id_2', orderItems: [], totalOrderPrice: 30 },
      ];

      // Mock function to return the orders for customer user
      Order.countDocuments = jest.fn().mockResolvedValue(mockOrders.length);
      Order.find = jest.fn().mockResolvedValue(mockOrders);

      // Mock request data
      mockReq.user = mockUser as any; // Use type assertion to provide the required properties.

      // Call the controller function
      await getAllOrders(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.countDocuments).toHaveBeenCalled();
      expect(Order.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        orders: mockOrders,
        page: 1,
        pages: 1, // Since pageSize is 10 and we have 2 orders, there will be only one page.
      });
    });

  describe('getOrderById', () => {
    it('should return order by ID for the same customer', async () => {
      const mockOrderId = 'order_id_1';
      const mockUserId = 'user_id_1';

      // Mock order data
      const mockOrder = {
        _id: mockOrderId,
        user: mockUserId,
        orderItems: [],
        totalOrderPrice: 20,
      };

      // Mock function to return the order for getOrderById
      Order.findById = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { orderID: mockOrderId };
      mockReq.user = {
        _id: mockUserId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '5554567890',
        address: { city: '34', district: 'Üsküdar' },
        role: 'customer',
      } as any;

      // Call the controller function
      await getOrderById(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it('should return order by ID for the cook', async () => {
      const mockOrderId = 'order_id_1';
      const mockCookId = 'cook_id_1';

      // Mock order data
      const mockOrder = {
        _id: mockOrderId,
        cookId: mockCookId,
        isDelivered: false,
        isPaid: true,
      };

      // Mock function to return the order for getOrderById
      Order.findById = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { orderID: mockOrderId };
      mockReq.user = {
        _id: mockCookId,
        firstname: 'Cook',
        lastname: 'Chef',
        email: 'cook@example.com',
        phone: '5559876543',
        role: 'cook',
        address: { city: '34', district: 'Üsküdar' },
      } as any;

      // Call the controller function
      await getOrderById(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it('should return order by ID for the admin', async () => {
      const mockOrderId = 'order_id_1';
      const mockAdminUserId = 'admin_user_id';

      // Mock order data
      const mockOrder = {
        _id: mockOrderId,
        user: 'user_id_2', // Use a different user ID to simulate a different order.
        orderItems: [],
        totalOrderPrice: 20,
      };

      // Mock function to return the order for getOrderById
      Order.findById = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { orderID: mockOrderId };
      mockReq.user = {
        _id: mockAdminUserId,
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        phone: '5551234567',
        role: 'admin',
        address: { city: '34', district: 'Üsküdar' },
      } as any;

      // Call the controller function
      await getOrderById(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ order: mockOrder });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status for the cook', async () => {
      const mockOrderId = 'order_id_1';
      const mockCookId = 'cook_id_1';

      // Mock order data
      const mockOrder = {
        _id: mockOrderId,
        cookId: mockCookId,
        isDelivered: false,
        isPaid: true,
      };

      // Mock function to return the order for getOrderById
      Order.findById = jest.fn().mockResolvedValue(mockOrder);
      Order.prototype.save = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { orderID: mockOrderId };
      mockReq.body = { isDelivered: true, isPaid: true };
      mockReq.user = {
        _id: mockCookId,
        firstname: 'Cook',
        lastname: 'Chef',
        email: 'cook@example.com',
        phone: '5559876543',
        role: 'cook',
        address: { city: '34', district: 'Üsküdar' },
      } as any;

      // Call the controller function
      await updateOrderStatus(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
      expect(Order.prototype.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it('should return an error if the user is neither cook nor admin', async () => {
      const mockOrderId = 'order_id_1';
      const mockUserId = 'user_id_1';

      // Mock order data
      const mockOrder = {
        _id: mockOrderId,
        cookId: 'cook_id_1',
        isDelivered: false,
        isPaid: true,
      };

      // Mock function to return the order for getOrderById
      Order.findById = jest.fn().mockResolvedValue(mockOrder);

      // Mock request data
      mockReq.params = { orderID: mockOrderId };
      mockReq.body = { isDelivered: true, isPaid: true };
      mockReq.user = {
        _id: mockUserId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phone: '5554567890',
        role: 'customer', // A customer role is used to simulate a non-privileged user.
        address: { city: '34', district: 'Üsküdar' },
      } as any;

      // Call the controller function
      await updateOrderStatus(mockReq as Request, mockRes as Response, mockNext);

      // Assertions
      expect(Order.findById).toHaveBeenCalledWith(mockOrderId);
      expect(Order.prototype.save).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });
})});
