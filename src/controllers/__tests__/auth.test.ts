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
const signinUser = require('../auth').signinUser;
const getUserProfile = require('../auth').getUserProfile;
const getAllUsers = require('../auth').getAllUsers;
const updateUser = require('../auth').updateUser;


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
            phone: '5554567890',
            address: { city: '34', district: 'Üsküdar' },
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

describe('signinUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = { status: jest.fn(), json: jest.fn() };
        next = jest.fn();
    });

    test('should return user data with a valid email and password', async () => {
        const email = 'john.doe@example.com';
        const password = 'password';

        const mockUser = {
            _id: 'user_id',
            firstname: 'John',
            lastname: 'Doe',
            email,
            phone: '5554567890',
            role: 'user',
            address: { city: '34', district: 'Üsküdar' },
            password: await bcrypt.hash(password, 10),
        };

        // Mock User.findOne to return the mockUser object.
        User.findOne.mockResolvedValueOnce(mockUser);

        // Mock generateToken to return a fixed token.
        generateToken.mockReturnValueOnce('mocked_token');

        const mockReq = { body: { email, password } } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await signinUser(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            _id: mockUser._id,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            email: mockUser.email,
            phone: mockUser.phone,
            role: mockUser.role,
            address: mockUser.address,
            token: 'mocked_token',
        });
    });

    test('should return error with invalid email and password', async () => {
        const email = 'john.doe@example.com';
        const password = 'wrong_password';

        const mockUser = {
            _id: 'user_id',
            firstname: 'John',
            lastname: 'Doe',
            email,
            phone: '5554567890',
            role: 'user',
            address: { city: '34', district: 'Üsküdar' },
            password: await bcrypt.hash('password', 10),
        };

        // Mock User.findOne to return the mockUser object.
        User.findOne.mockResolvedValueOnce(mockUser);

        const mockReq = { body: { email, password } } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await signinUser(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
    });
});


describe('getUserProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return user profile data for admin user', async () => {
        const mockAdminUserID = 'admin_user_id';
        const mockUser = {
            _id: 'user_id',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '5554567890',
            role: 'user',
            address: { city: '34', district: 'Üsküdar' },
        };

        // Mock the user object for an admin user.
        const mockAdminUser = {
            _id: mockAdminUserID,
            role: 'admin',
        };
        User.findById.mockResolvedValueOnce(mockUser);

        const mockReq = { user: mockAdminUser, params: { userID: mockUser._id } } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await getUserProfile(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith(mockUser._id);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            _id: mockUser._id,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            email: mockUser.email,
            phone: mockUser.phone,
            role: mockUser.role,
            address: mockUser.address,
        });
    });

    test('should return user profile data for non-admin user', async () => {
        const mockUserID = 'user_id';
        const mockUser = {
            _id: mockUserID,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '5554567890',
            role: 'user',
            address: { city: '34', district: 'Üsküdar' },
        };

        // Mock the user object for a non-admin user.
        const mockNonAdminUser = {
            _id: mockUserID,
            role: 'user',
        };
        User.findById.mockResolvedValueOnce(mockUser);

        const mockReq = { user: mockNonAdminUser } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await getUserProfile(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith(mockUserID);
        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            _id: mockUser._id,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            email: mockUser.email,
            phone: mockUser.phone,
            role: mockUser.role,
            address: mockUser.address,
        });
    });

});
