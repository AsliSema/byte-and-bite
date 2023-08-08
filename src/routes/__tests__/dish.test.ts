import request from 'supertest';
import app from '../../app';
import Dish from '../../models/dish';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import generateToken from '../../utils/generateToken';

describe('Dish routes', () => {
  let dish;
  let authToken;
  let user;

  const dish_test_1 = {
    name: 'Test_Dish_data_1',
    description: 'Test dish description',
    images: ['image-5'],
    quantity: 33,
    price: 100,
    category: 'breakfast',
    specificAllergies: ['something'],
  };
  const dish_test_2 = {
    name: 'Test_Dish_data_2',
    description: 'Test dish description',
    images: ['image-5'],
    quantity: 33,
    price: 100,
    category: 'breakfast',
    specificAllergies: ['something'],
  };
  const testUser2 = {
    firstname: 'Test 2',
    lastname: 'User 2',
    email: 'test5t@example.com',
    password: 'testpassword',
    phone: '5554567890',
    address: {
      city: '16',
      district: 'Nilüfer',
      neighborhood: 'Ertuğrul Mah',
      addressInfo: 'No: 16, Dr: 7',
    },
  };

  beforeAll(async () => {
    // Create a new dish for test.
    dish = await Dish.create({
      name: dish_test_1.name,
      description: dish_test_1.description,
      images: dish_test_1.images,
      quantity: dish_test_1.quantity,
      price: dish_test_1.price,
      category: dish_test_1.category,
      specificAllergies: dish_test_1.specificAllergies,
    });

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
    // for creating new dish/update dish information, the role of that user should be cook.
    user.role = 'cook';
    dish.cook = user.id;

    await user.save();
    await dish.save();

    authToken = generateToken(user._id);
  });
  afterAll(async () => {
    // Cleanup: Delete the test user/dish from the database
    await Dish.findOneAndDelete({ name: dish.name });
    await Dish.findOneAndDelete({ name: dish_test_2.name });
    await User.findOneAndDelete({ email: testUser2.email });
  });

  /*Get All Dishes - 2 Test*/
  describe('GET /api/dish', () => {
    it('should get all dishes', async () => {
      const response = await request(app).get('/api/dish');
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
    it('should get all dishes that belong to that cook.', async () => {
      const response = await request(app).get('/api/dish').set('Authorization', `Bearer ${authToken}`);
      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });
  /*Get Dish by ID - 2 Tests*/
  describe('GET /api/dish/:id', () => {
    it('should get a dish by id', async () => {
      const response = await request(app).get(`/api/dish/${dish.id}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.data.id).toBe(dish.id);
    });

    it('should return 400 if dish not found', async () => {
      const response = await request(app).get('/api/dish/123');
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  /*Create new dish - 2 Test*/
  describe('POST /api/dish', () => {
    it('should create a new dish', async () => {
      const response = await request(app).post('/api/dish').set('Authorization', `Bearer ${authToken}`).send(dish_test_2);

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.body.data.name).toBe(dish_test_2.name);
    });
    it('should return 401 if customers try to create new dish.', async () => {
      const response = await request(app).post('/api/dish').send(dish_test_2);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
  /*Update dish by ID - 3 Tests*/
  describe('PUT /api/dish/:id', () => {
    it('should update a dish', async () => {
      const updates = {
        name: 'Updated Dish Name_1',
      };

      const response = await request(app).put(`/api/dish/${dish.id}`).set('Authorization', `Bearer ${authToken}`).send(updates);
      expect(response.body.data.name).toBe(updates.name);
    });
    it('should return 400 if dish not found', async () => {
      const updates = {
        name: 'Updated Name',
      };

      const response = await request(app).put('/api/dish/123').set('Authorization', `Bearer ${authToken}`).send(updates);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
    it('should return 401 if no token provided', async () => {
      const updates = {
        name: 'Updated Name',
      };

      const response = await request(app).put(`/api/dish/${dish.id}`).send(updates);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
  /*Delete dish by ID - 3 Tests*/
  describe('DELETE /api/dish/:id', () => {
    it('should delete a dish', async () => {
      const response = await request(app).delete(`/api/dish/${dish.id}`).set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.body.data.id).toBe(dish.id);
    });

    it('should return 400 if dish does not exist', async () => {
      const invalidId = '123';

      const response = await request(app).delete(`/api/dish/${invalidId}`).set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 401 UNAUTHORIZED if invalid token', async () => {
      const response = await request(app).delete(`/api/dish/${dish.id}`);

      expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
