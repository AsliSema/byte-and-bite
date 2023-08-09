import request from 'supertest';
import app from '../../app';
import { StatusCodes } from 'http-status-codes';
import User from '../../models/user';
import generateToken from '../../utils/generateToken';
import bcrypt from 'bcrypt';
import Order from '../../models/order';
import Dish from '../../models/dish';

describe('test specific admin routes', () => {
  let customerUser;
  let adminUser;
  let cookUser;
  let adminToken;
  let order;
  let customerToken;
  let dish;

  beforeAll(async () => {
    // Create test users with hashed passwords
    customerUser = await User.create({
      firstname: 'Test',
      lastname: 'User',
      email: 'test11@example.com',
      password: 'testpassword',
      phone: '5554567890',
      address: {
        city: '16',
        district: 'Nilüfer',
        neighborhood: 'Ertuğrul Mah',
        addressInfo: 'No: 16, Dr: 7',
      },
    });

    customerToken = generateToken(customerUser._id);

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
    cookUser.role = 'cook';
    await cookUser.save();

    // const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
    adminUser = await User.create({
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin111@example.com',
      password: 'adminpassword',
      phone: '5554567890',
      address: {
        city: '16',
        district: 'Nilüfer',
        neighborhood: 'Ertuğrul Mah',
        addressInfo: 'No: 16, Dr: 7',
      },
    });
    adminUser.role = 'admin';
    await adminUser.save();

    adminToken = generateToken(adminUser._id);

    //create dish
    dish = await Dish.create({
      name: 'Test Dish 11',
      cook: cookUser._id,
      description: 'dish57dish18dish14dish4dish4',
      images: ['dish image'],
      quantity: 5,
      price: 17,
      category: 'dinner',
    });

    // Create a test order
    order = await Order.create({
      user: customerUser._id,
      cookId: cookUser._id,
      orderItems: [
        {
          product: dish._id,
          quantity: 2,
        },
      ],
      deliveryFee: 5,
      deliveryAddress: 'Test Address',
      totalOrderPrice: 34,
    });
  });

  afterAll(async () => {
    // Clean up test data from the database
    await User.findOneAndDelete({ email: customerUser.email });
    await User.findOneAndDelete({ email: cookUser.email });
    await User.findOneAndDelete({ email: adminUser.email });
    await Dish.findOneAndDelete({ _id: dish._id });
    await Order.findOneAndDelete({ _id: order._id });
  });

  describe('DELETE /api/admin/users/userID', () => {
    it('Should delete user profile', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${customerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('message', 'User deleted');
    });
    it('Should return 400 in case of unauthorized user', async () => {
      const response = await request(app).delete(
        `/api/admin/users/${customerUser._id}`
      );

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty(
        'message',
        'You are not login, Please login to get access this route'
      );
    });
  });

  describe('PUT /api/admin/order/:orderID', () => {
    it('updates order status as admin', async () => {
      const response = await request(app)
        .put(`/api/admin/order/${order._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isDelivered: true,
          isPaid: true,
        });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('order');
      expect(response.body.order._id).toEqual(order._id.toString());

      expect(response.body.order).toHaveProperty('isDelivered', true);
      expect(response.body.order).toHaveProperty('isPaid', true);
    });
  });
});
