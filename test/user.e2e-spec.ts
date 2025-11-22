// test/user.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { generateTestEmail, registerUser, loginUser, getProfile } from './user.test.utils';

/**
 * End‑to‑end tests covering user registration, login and profile endpoints.
 * All tests are isolated – each test creates its own user using a random email.
 */

describe('User Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration', () => {
    it('should register a new user successfully', async () => {
      const email = generateTestEmail();
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email,
        password: 'Password123',
      };
      const response = await registerUser(app, payload);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        email,
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should reject duplicate email registration', async () => {
      const email = generateTestEmail();
      const payload = {
        firstName: 'Jane',
        lastName: 'Doe',
        email,
        password: 'Password123',
      };
      // first registration succeeds
      await registerUser(app, payload);
      // second registration should fail with 409 Conflict
      await request(app.getHttpServer()).post('/v1/register').send(payload).expect(409);
    });

    it('should validate email format', async () => {
      const payload = {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'invalid-email',
        password: 'Password123',
      };
      await request(app.getHttpServer()).post('/v1/register').send(payload).expect(400);
    });

    it('should enforce password length', async () => {
      const payload = {
        firstName: 'Alice',
        lastName: 'Wong',
        email: generateTestEmail(),
        password: '123', // too short
      };
      await request(app.getHttpServer()).post('/v1/register').send(payload).expect(400);
    });

    it('should require first and last name (min 2 chars)', async () => {
      const payload = {
        firstName: 'A',
        lastName: 'B',
        email: generateTestEmail(),
        password: 'Password123',
      };
      await request(app.getHttpServer()).post('/v1/register').send(payload).expect(400);
    });
  });

  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const email = generateTestEmail();
      const password = 'Password123';
      const registerPayload = {
        firstName: 'Login',
        lastName: 'User',
        email,
        password,
      };
      await registerUser(app, registerPayload);
      const token = await loginUser(app, { email, password });
      expect(token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const email = generateTestEmail();
      const password = 'Password123';
      await registerUser(app, { firstName: 'Bad', lastName: 'Pass', email, password });
      await request(app.getHttpServer()).post('/v1/login').send({ email, password: 'WrongPass' }).expect(401);
    });

    it('should reject non‑existent email', async () => {
      await request(app.getHttpServer())
        .post('/v1/login')
        .send({ email: 'doesnot@exist.com', password: 'any' })
        .expect(401);
    });
  });

  describe('Profile', () => {
    it('should retrieve profile with valid JWT', async () => {
      const email = generateTestEmail();
      const password = 'Password123';
      await registerUser(app, { firstName: 'Profile', lastName: 'User', email, password });
      const token = await loginUser(app, { email, password });
      const response = await getProfile(app, token);
      expect(response.body).toMatchObject({ email, firstName: 'Profile', lastName: 'User' });
    });

    it('should reject request without Authorization header', async () => {
      await request(app.getHttpServer()).get('/v1/profile').expect(401);
    });

    it('should reject request with malformed token', async () => {
      await request(app.getHttpServer()).get('/v1/profile').set('Authorization', 'Bearer malformed.token').expect(401);
    });
  });
});
