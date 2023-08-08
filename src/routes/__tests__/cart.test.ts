import request from 'supertest';
import app from '../../app';
import { config } from '../../config/config';
import { StatusCodes } from 'http-status-codes';
import User from '../../models/user';
import generateToken from '../../utils/generateToken';
import Dish from '../../models/dish';

describe('Cart routes', () => {

    let customerUser;
    let customerToken;
    let cookUser;
    let cookToken;
    let testDish;

    beforeAll(async () => {
        // create a test customer
        customerUser = await User.create({
            firstname: 'Customer',
            lastname: 'Cart',
            email: 'customer@cart.test',
            password: 'testpassword',
            phone: '5554567890',
            address: {
                city: '16',
                district: 'Nilüfer',
                neighborhood: 'Ertuğrul Mah',
                addressInfo: 'No: 16, Dr: 7',
            }
        });
        customerToken = generateToken(customerUser._id);

        // create a test cook
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
            }
        });
        cookUser.role = 'cook'
        await cookUser.save();

        cookToken = generateToken(cookUser._id);

        //create a test dish
        testDish = await Dish.create({
            name: "Test Dish",
            cook: cookUser._id,
            description: "This dish is for testing purposes only",
            images: ["dishImage.jpg"],
            quantity: 100,
            price: 10,
            category: "dinner"
        });
    });

    afterAll(async () => {
        // Clean up test data from the test database
        await User.findOneAndDelete({ email: customerUser.email });
        await User.findOneAndDelete({ email: cookUser.email });
        await Dish.findOneAndDelete({ _id: testDish._id });
    });

    describe('POST /api/cart', () => {
        it('adds dish to cart', async () => {
            const newItem = {
                dishID: testDish._id.toString(),
                quantity: 2
            };

            const response = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`)
                .send(newItem);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.arrayContaining([expect.objectContaining({ product: newItem.dishID })]));
        });
    });

    describe('GET /api/cart when there is a cart', () => {
        it('gets cart for customer', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.any(Array));
        });
    });

    describe('PUT /api/cart/{dishID}', () => {
        it('updates dish quantity in cart', async () => {
            const quantity = 3;

            const response = await request(app)
                .put(`/api/cart/${testDish._id.toString()}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ quantity });

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.arrayContaining([expect.objectContaining({ product: testDish._id.toString(), quantity })]));
        });
    });

    describe('DELETE /api/cart/{dishID}', () => {
        it('deletes a dish from cart', async () => {
            const response = await request(app)
                .delete(`/api/cart/${testDish._id.toString()}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send();

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems.find(item => item.id === testDish._id.toString())).toBeFalsy();
        });
    });

    describe('DELETE /api/cart', () => {
        it('deletes customer\'s cart', async () => {
            const response = await request(app)
                .delete(`/api/cart`)
                .set('Authorization', `Bearer ${customerToken}`)
                .send();

            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT); // best if there is response like message 'deleted successfully'
        });
    });

    describe('GET api/cart/', () => {
        it('It returns 404 (NOT_FOUND) if the customer don\'t have a cart', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

});