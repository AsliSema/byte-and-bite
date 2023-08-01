//@ts-nocheck
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from '../../types/express';
import User, { Address } from '../../models/user';
import generateToken from '../../utils/generateToken';
import { ApiError } from '../../utils/apiError';
import bcrypt from 'bcrypt';

jest.mock('../../models/user');
jest.mock('../../utils/generateToken');

const registerUser = require('../auth').registerUser;

describe('registerUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn(), json: jest.fn() };
        next = jest.fn();
    });

    test('should return error if user already exists', async () => {
        User.findOne.mockReturnValueOnce(Promise.resolve(true));

        await registerUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });


    it('should register a new user successfully', async () => {
        const mockUser = {
            _id: 'user_id',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: { city: 'New York', zip: '10001' },
            password: 'password',
        };

        // Mock User.findOne to return null, indicating the user does not exist.
        User.findOne.mockResolvedValueOnce(null);

        // Mock User.create to return the mockUser object.
        User.create.mockResolvedValueOnce(mockUser);

        // Mock generateToken to return a fixed token.
        generateToken.mockReturnValueOnce('mocked_token');

        const mockReq = { body: mockUser } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await registerUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.CREATED);
        expect(mockRes.json).toHaveBeenCalledWith({
            _id: mockUser._id,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            email: mockUser.email,
            phone: mockUser.phone,
            address: mockUser.address,
            token: 'mocked_token',
        });
    });



});