import request from 'supertest';
import app from '../../app';
import Dish from '../../models/dish';
import User from '../../models/user';
import { StatusCodes } from 'http-status-codes';
import generateToken from '../../utils/generateToken';
import Cart from '../../models/cart';
import Order from '../../models/order';

describe('Order routes', () => {

  let authToken;
  let customerUser;
  let dish;
  let cookUser;
  let cart;
  let order;
  let cookToken;

  beforeAll(async () => {
    // Create a test user with a hashed password
    customerUser = await User.create({
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'testpassword',
      phone: '5554567890',
      address: {
        city: '16',
        district: 'Nilüfer',
        neighborhood: 'Ertuğrul Mah',
        addressInfo: 'No: 16, Dr: 7',
      },
    });
    authToken = generateToken(customerUser._id);

    cookUser = await User.create({
      firstname: 'Test Cook',
      lastname: 'User',
      email: 'cook11@example.com',
      password: 'testpassword',
      phone: '5554567890',
      address: {
        city: '16',
        district: 'Nilüfer',
        neighborhood: 'Ertuğrul Mah',
        addressInfo: 'No: 16, Dr: 7',
      },
    });
    cookToken = generateToken(cookUser._id);

    cookUser.role = 'cook';
    await cookUser.save();

    dish = await Dish.create({
      name: 'Test Dish 13',
      cook: cookUser._id,
      description: 'dish57dish18dish14dish4dish4',
      images: ['dish image'],
      quantity: 5,
      price: 17,
      category: 'dinner',
    });

    cart = await Cart.create({
      user: customerUser._id,
      cookID: cookUser._id,
      cartItems: [
        {
          product: dish._id,
          quantity: 2,
        },
      ],
      totalCartPrice: 34,
    });

  });

  afterAll(async () => {
    // Cleanup: Delete the test user from the database
    await User.findOneAndDelete({ email: customerUser.email });
    await Dish.findOneAndDelete({ _id: dish._id });
    await User.findOneAndDelete({ email: cookUser.email });
    await Cart.findOneAndDelete({ _id: cart._id });
    await Order.findOneAndDelete({ _id: order._id });
  });

  describe('POST /api/order/:cartId', () => {
    it('should creates a new order and return 201', async () => {
      const response = await request(app)
        .post(`/api/order/${cart._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      order = response.body.data;

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body.data.user).toEqual(cart.user.toString());
    });
    it('Should return 401 in case the user is not authorized', async () => {
      const response = await request(app).post(`/api/order/${cart._id}`);
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('PUT /api/order/:orderID', () => {
    it('Should update the order status and return 200', async () => {
      const updatedStatus = {
        isPaid: true,
        isDelivered: true,
      };

      const response = await request(app)
        .put(`/api/order/${order._id}`)
        .set('Authorization', `Bearer ${cookToken}`)
        .send(updatedStatus);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order._id).toEqual(order._id.toString());

      expect(response.body.order).toHaveProperty('isDelivered', true);
      expect(response.body.order).toHaveProperty('isPaid', true);
    });

    it('Should return 401 in case the user is not authorized', async () => {
      const updatedStatus = {
        isPaid: true,
        isDelivered: true,
      };

      const response = await request(app)
        .put(`/api/order/${order._id}`)
        .send(updatedStatus);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /api/order/:orderID', () => {
    it('Should get the order by ID and return 200', async () => {
      const response = await request(app)
        .get(`/api/order/${order._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
    });
    it('Should return 401 in case the user is not authorized', async () => {
      const response = await request(app).get(`/api/order/${order._id}`);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /api/order', () => {
    it('Should get All orders that belong to cook and return 200', async () => {
      const response = await request(app)
        .get('/api/order')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
    });

    it('Should return 401 in case the user is not authorized', async () => {
      const response = await request(app).get('/api/order');
      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});