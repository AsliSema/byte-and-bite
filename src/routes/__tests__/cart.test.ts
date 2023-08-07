import request from 'supertest';
import app from '../../app';
import { config } from '../../config/config';
import { StatusCodes } from 'http-status-codes';

describe('Cart routes', () => {

    const token = config.testCustomer.token;
    const dishID = config.testDish.id;

    describe('POST /api/cart', () => {
        it('adds dish to cart', async () => {
            const newItem = {
                dishID,
                quantity: 2
            };

            const response = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${token}`)
                .send(newItem);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.arrayContaining([expect.objectContaining({ product: newItem.dishID })]));
        });
    });

    describe('GET /api/cart when there is a cart', () => {
        it('gets cart for customer', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.any(Array));
        });
    });

    describe('PUT /api/cart/{dishID}', () => {
        it('updates dish quantity in cart', async () => {
            const quantity = 3;

            const response = await request(app)
                .put(`/api/cart/${dishID}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ quantity });

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems).toEqual(expect.arrayContaining([expect.objectContaining({ product: dishID, quantity })]));
        });
    });

    describe('DELETE /api/cart/{dishID}', () => {
        it('deletes a dish from cart', async () => {
            const response = await request(app)
                .delete(`/api/cart/${dishID}`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(response.statusCode).toBe(StatusCodes.OK);
            expect(response.body.data.cartItems.find(item => item.id === dishID)).toBeFalsy();
        });
    });

    describe('DELETE /api/cart', () => {
        it('deletes customer\'s cart', async () => {
            const response = await request(app)
                .delete(`/api/cart`)
                .set('Authorization', `Bearer ${token}`)
                .send();

            expect(response.statusCode).toBe(StatusCodes.NO_CONTENT); // best if there is response like message 'deleted successfully'
        });
    });

    describe('GET api/cart/', () => {
        it('It returns 404 (NOT_FOUND) if the customer don\'t have a cart', async () => {
            const response = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

});