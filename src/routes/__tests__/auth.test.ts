import request from 'supertest';
import { server } from '../../app';
import { StatusCodes } from 'http-status-codes';
import User from '../../models/user';
import generateToken from '../../utils/generateToken';
import bcrypt from 'bcrypt';

describe('Auth routes', () => {
  const testUser = {
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
  };

  const testUser2 = {
    firstname: 'Test 2',
    lastname: 'User 2',
    email: 'test2@example.com',
    password: 'testpassword',
    phone: '5554567890',
    address: {
      city: '16',
      district: 'Nilüfer',
      neighborhood: 'Ertuğrul Mah',
      addressInfo: 'No: 16, Dr: 7',
    },
  };

  let authToken;
  let user;

  beforeAll(async () => {
    // Create a test user with a hashed password
    const hashedPassword = await bcrypt.hash(testUser2.password, 10);
    user = await User.create({
      firstname: testUser2.firstname,
      lastname: testUser2.lastname,
      email: testUser2.email,
      password: hashedPassword,
      phone: testUser2.phone,
      address: testUser2.address,
    });

    authToken = generateToken(user._id);
  });

  afterAll(async () => {
    // Cleanup: Delete the test user from the database
    await User.findOneAndDelete({ email: testUser.email });
    server.close();
  });

  describe('POST /api/users/signup', () => {
    it('Should register a new user', async () => {
      const response = await request(server)
        .post('/api/users/signup')
        .send(testUser);

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('firstname', testUser.firstname);
    });

    it('Should fail to register with an already existing email', async () => {
      const response = await request(server)
        .post('/api/users/signup')
        .send(testUser);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors[0]).toHaveProperty(
        'msg',
        'E-mail already exist'
      );
    });
  });

  describe('POST /api/users/signin', () => {
    it('Should sign in an existing user with correct credentials', async () => {
      const response = await request(server)
        .post('/api/users/signin')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('firstname', testUser.firstname);
    });

    it('Should fail to sign in with incorrect password', async () => {
      const response = await request(server)
        .post('/api/users/signin')
        .send({ email: testUser.email, password: 'incorrectpassword' });

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty(
        'message',
        'Incorrect password or Email address'
      );
    });
  });

  describe('GET /api/users/profile', () => {
    it('Should return user profile', async () => {
      const response = await request(server)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('firstname', user.firstname);
    });

    it('Should return error if there is no logged in user', async () => {
      const emptyToken = '';
      const response = await request(server)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${emptyToken}`);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('PUT /api/users/:userID', () => {
    it('Should update user information', async () => {
      const updatedUserInfo = {
        firstname: 'Updated',
        lastname: 'Info',
        phone: '5559876543',
        address: {
          city: '16',
          district: 'Nilüfer',
          neighborhood: 'Ertuğrul Mah',
          addressInfo: 'No: 987, Street: 65',
        },
      };

      // Make the update request
      const updateResponse = await request(server)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedUserInfo);

      expect(updateResponse.statusCode).toBe(StatusCodes.OK);
      expect(updateResponse.body).toHaveProperty('_id');
      expect(updateResponse.body).toHaveProperty(
        'firstname',
        updatedUserInfo.firstname
      );
      expect(updateResponse.body).toHaveProperty(
        'lastname',
        updatedUserInfo.lastname
      );
      expect(updateResponse.body).toHaveProperty(
        'phone',
        updatedUserInfo.phone
      );
    });

    it('Should fail to update user information without authorization', async () => {
      const updatedUserInfo = {
        firstname: 'Updated',
        lastname: 'Info',
        phone: '5559876543',
      };

      const updateResponse = await request(server)
        .put('/api/users/:userID')
        .send(updatedUserInfo);

      expect(updateResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(updateResponse.body).toHaveProperty(
        'message',
        'You are not login, Please login to get access this route'
      );
    });

    it('Should fail to update user information with invalid data', async () => {
      const updatedUserInfo = {
        email: 'testuser',
        phone: '1234566783',
        // Invalid data, missing required fields or wrong formats
      };

      const response = await request(server)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedUserInfo);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('DELETE /api/users', () => {
    it('Should delete own user profile', async () => {
      const response = await request(server)
        .delete('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('message', 'User deleted');
      expect(response.body.deletedUser).toHaveProperty('_id');
      expect(response.body.deletedUser._id).toEqual(user._id.toString());
    });

    it('Should return error if there is no logged in user', async () => {
      const emptyToken = '';
      const response = await request(server)
        .delete('/api/users')
        .set('Authorization', `Bearer ${emptyToken}`);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
