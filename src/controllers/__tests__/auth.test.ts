//@ts-nocheck
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from '../../types/express';
import User, { Address } from '../../models/user';
import generateToken from '../../utils/generateToken';
import { ApiError } from '../../utils/apiError';
import bcrypt from 'bcrypt';

import { registerUser, signinUser, getUserProfile, getAllUsers, updateUser, deleteUser} from '../auth';


jest.mock('../../models/user');
jest.mock('../../utils/generateToken');


describe('Auth Controller Unit Tests', () => {


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
            _id: '64b41c1e2e4ef3642d657366',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '5554567890',
            address: { city: '34', district: 'Üsküdar', neighborhood: 'Mimar Sinan Mah', addressInfo: 'Fahri Atabey Cad. No : 9' },
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
            _id: '64b41c1e2e4ef3642d657367',
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
            _id: '64b41c1e2e4ef3642d657367',
            firstname: 'John',
            lastname: 'Doe',
            email,
            phone: '5554567890',
            role: 'customer',
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
        const mockAdminUserID = '37b2be6bf846db255f4f21bb';
        const mockUser = {
            _id: "64b2be6bf846db255f4f21ca",
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '5554567890',
            role: 'customer',
            isActive: true,
            address: {
                city: '16', district: 'Nilüfer', neighborhood: 'Yüzüncüyıl Mah', addressInfo: '415.Sokak Özlüce'
            }
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
        const mockUserID = '64b2be6bf846db255f4f21ca';
        const mockUser = {
            _id: mockUserID,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            phone: '5554567890',
            role: 'customer',
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

describe('updateUser', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  const existingUserID = '64b41c1e2e4ef3642d657366';
  const adminUserID = '64b2be6bf846db255f4f21ca';
  const userRole = 'customer';
  const adminRole = 'admin';

  beforeEach(() => {
    req = {
      body: {
        firstname: 'John Updated',
        lastname: 'Doe Updated',
        email: 'john.doeupdated@example.com',
        phone: '5551234567',
        profileImage: 'updated_profile_image.jpg',
        password: 'updated_password',
        role: 'cook',
        isActive: false,
        address: {
          city: '16',
          district: 'Nilüfer',
          neighborhood: 'Yüzüncüyıl Mah',
          addressInfo: '415.Sokak Özlüce',
        },
      },
      params: { userID: existingUserID },
      user: {
        _id: adminUserID,
        role: adminRole,
      },
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update user successfully as an admin', async () => {
    // Mock the user object to return the existing user with admin role
    User.findById.mockResolvedValueOnce({
      _id: existingUserID,
      role: userRole,
      save: jest.fn().mockResolvedValue({
        _id: existingUserID,
        ...req.body, // The updated user data
      } as IUser),
    });

    await updateUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith(existingUserID);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      _id: existingUserID,
      ...req.body, // The updated user data
    });
  });

  test('should update user successfully as the user themselves', async () => {
    // Mock the user object to return the existing user with customer role
    req.user._id = existingUserID;
    User.findById.mockResolvedValueOnce({
      _id: existingUserID,
      role: userRole,
      save: jest.fn().mockResolvedValue({
        _id: existingUserID,
        ...req.body, // The updated user data
      } as IUser),
    });

    await updateUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith(existingUserID);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      _id: existingUserID,
      ...req.body, // The updated user data
    });
  });
});

describe('deleteUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should delete the user if the requester is an admin', async () => {
        // Mock the user object with admin role
        const mockAdminUser = {
            _id: '37b2be6bf846db255f4f21bb',
            role: 'admin',
        };

        // Mock User.findByIdAndDelete to return the deleted user object
        User.findByIdAndDelete.mockResolvedValueOnce({ _id: '64b41c1e2e4ef3642d657366', firstname: 'John', lastname: 'Doe' });

        const mockReq = { user: mockAdminUser, params: { userID: '64b2be6bf846db255f4f21ca' } } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await deleteUser(mockReq, mockRes, mockNext);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith('64b2be6bf846db255f4f21ca');
        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'User deleted',
            deletedUser: { _id: '64b41c1e2e4ef3642d657366', firstname: 'John', lastname: 'Doe' },
        });
    });

    test('should delete the user himself/herself', async () => {
        // Mock the user object without admin role
        const mockRegularUser = {
            _id: 'regular_user_id',
            role: 'user',
        };

        // Mock User.findByIdAndDelete to return the deleted user object
        User.findByIdAndDelete.mockResolvedValueOnce({ _id: 'deleted_user_id', firstname: 'Deleted', lastname: 'User' });

        const mockReq = { user: mockRegularUser } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await deleteUser(mockReq, mockRes, mockNext);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith('regular_user_id');
        expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.OK);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'User deleted',
            deletedUser: { _id: 'deleted_user_id', firstname: 'Deleted', lastname: 'User' },
        });
    });

    test('should return an error if user is not found', async () => {
        // Mock the user object without admin role
        const mockRegularUser = {
            _id: '64b2be6bf846db255f4f21ca',
            role: 'customer',
        };

        // Mock User.findByIdAndDelete to return null, indicating the user was not found
        User.findByIdAndDelete.mockResolvedValueOnce(null);

        const mockReq = { user: mockRegularUser } as Request;
        const mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        } as Response;
        const mockNext = jest.fn() as NextFunction;

        await deleteUser(mockReq, mockRes, mockNext);

        expect(User.findByIdAndDelete).toHaveBeenCalledWith('64b2be6bf846db255f4f21ca');
        expect(mockNext).toHaveBeenCalledWith(new ApiError(StatusCodes.BAD_REQUEST, 'User not found'));
    });
});

describe('getAllUsers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of users with pagination information', async () => {
        const mockUsers = [
            {
              _id: "64b41c1e2e4ef3642d657366",
              firstname: 'Emma',
              lastname: 'Johnson',
              email: 'emma.johnson@example.com',
              phone: '5533455663',
              password: '$2b$10$I8KPd2PPr1D0fWZOAgYab.u1v4opVgHMV2ITPaktkoZkqRGnq6/eG',
              role: 'cook',
              isActive: true,
              address: {
                city: '34',
                district: 'Üsküdar',
                neighborhood: 'Mimar Sinan Mah',
                addressInfo: 'Fahri Atabey Cad. No : 9'
              },
            },
            {
              _id: "64b2be6bf846db255f4f21ca",
              firstname: 'Micheal',
              lastname: 'Brown',
              email: 'michael.brown@example.com',
              phone: '5532263773',
              password: '$2b$10$iYOoetuOoo/nAbCM8CRyNOV5heK1l3DrRFm3mENPk7pT7PsNvpw4C',
              role: 'customer',
              isActive: true,
              address: {
                city: '16',
                district: 'Nilüfer',
                neighborhood: 'Yüzüncüyıl Mah',
                streetAddress: '415.Sokak Özlüce'
              },
            },
            // Add more mock users as needed
        ];

        // Mock the Request and Response objects
        const mockReq = {
            query: {
                pageSize: 5,
                pageNumber: 2,
            },
        } as any;

        const mockRes = {
            json: jest.fn(),
        } as any;

        // Mock the User.countDocuments to return a fixed count
        User.countDocuments = jest.fn().mockResolvedValue(mockUsers.length);

        // Mock the User.find to return the mockUsers based on the provided pagination options
        const findMock = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue(mockUsers), // Return mockUsers after applying pagination
        });
        User.find = findMock;

        // Call the getAllUsers function with the mock Request and Response
        await getAllUsers(mockReq, mockRes, jest.fn());

        // Expectations
        expect(User.countDocuments).toHaveBeenCalled();
        expect(findMock).toHaveBeenCalled();
        expect(findMock().limit).toHaveBeenCalledWith(5); // Expect limit to be called with 5
        expect(findMock().skip).toHaveBeenCalledWith(5); // Expect skip to be called with 5
        expect(mockRes.json).toHaveBeenCalledWith({
            Users: mockUsers,
            page: 2,
            pages: 1, // Since pageSize is 5 and we have 2 mock users, there is only one page
        });
    });

    it('should use default values for pageSize and pageNumber if not provided in the query', async () => {
        const mockUsers = [
            {
                _id: "64b41c1e2e4ef3642d657366",
                firstname: 'Emma',
                lastname: 'Johnson',
                email: 'emma.johnson@example.com',
                phone: '5533455663',
                password: '$2b$10$I8KPd2PPr1D0fWZOAgYab.u1v4opVgHMV2ITPaktkoZkqRGnq6/eG',
                role: 'cook',
                isActive: true,
                address: {
                  city: '34',
                  district: 'Üsküdar',
                  neighborhood: 'Mimar Sinan Mah',
                  addressInfo: 'Fahri Atabey Cad. No : 17'
                },
            },
            {
                _id: "64b2be6bf846db255f4f21ca",
                firstname: 'Micheal',
                lastname: 'Brown',
                email: 'michael.brown@example.com',
                phone: '5532263773',
                password: '$2b$10$iYOoetuOoo/nAbCM8CRyNOV5heK1l3DrRFm3mENPk7pT7PsNvpw4C',
                role: 'customer',
                isActive: true,
                address: {
                  city: '16',
                  district: 'Nilüfer',
                  neighborhood: 'Yüzüncüyıl Mah',
                  streetAddress: '415.Sokak Özlüce'
                },
            },
            {
                _id: "33b2be6bf846db255f4f21bb",
                firstname: 'Mia',
                lastname: 'Martinez',
                email: 'mia.martinez@example.com',
                phone: '5534463713',
                password: '$2b$10$iYOoetuOoo/nAbCM8CRyNOV5heK1l3DrRFm3mENPk7pT7PsNvpw4C',
                role: 'customer',
                isActive: true,
                address: {
                  city: '16',
                  district: 'Nilüfer',
                  neighborhood: 'Yüzüncüyıl Mah',
                  streetAddress: '410.Sokak Özlüce'
                },
            },
        ];
    
        // Mock the Request and Response objects without providing pageSize and pageNumber in the query
        const mockReq = {
            query: {},
        } as any;
    
        const mockRes = {
            json: jest.fn(),
        } as any;
    
        // Mock the User.countDocuments to return a fixed count
        User.countDocuments = jest.fn().mockResolvedValue(mockUsers.length);
    
        // Mock the User.find to return the mockUsers based on the provided pagination options
        const findMock = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValue(mockUsers),
        });
        User.find = findMock;
    
        // Call the getAllUsers function with the mock Request and Response
        await getAllUsers(mockReq, mockRes, jest.fn());
    
        // Expectations
        expect(User.countDocuments).toHaveBeenCalled();
        expect(findMock).toHaveBeenCalled();
        expect(findMock().limit).toHaveBeenCalledWith(10); // Expect limit to be called with the default value (10)
        expect(findMock().skip).toHaveBeenCalledWith(0); // Expect skip to be called with the default value (0)
        expect(mockRes.json).toHaveBeenCalledWith({
            Users: mockUsers,
            page: 1, // Since the default pageNumber is 1
            pages: 1, // Since pageSize is 10 and we have 3 mock users, there is only one page
        });
    });
    
});

});


