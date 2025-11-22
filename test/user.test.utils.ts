// test/user.test.utils.ts

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { v7 } from 'uuid';

/**
 * Generates a random email for test isolation.
 */
export const generateTestEmail = () => `test-${v7()}@example.com`;

/**
 * Registers a new user via the e2e API.
 * Returns the full SuperTest response so callers can inspect the `data` field.
 */
export const registerUser = async (app: INestApplication, payload: Record<string, any>) => {
  return request(app.getHttpServer()).post('/v1/register').send(payload).expect(201);
};

/**
 * Logs in a user and returns the JWT token.
 * The controller wraps the token inside `data.token`.
 */
export const loginUser = async (app: INestApplication, payload: { email: string; password: string }) => {
  const response = await request(app.getHttpServer()).post('/v1/login').send(payload).expect(200);
  return (response.body.data?.token ?? response.body.token) as string;
};

/**
 * Retrieves the profile of the authenticated user.
 */
export const getProfile = async (app: INestApplication, token: string) => {
  return request(app.getHttpServer()).get('/v1/profile').set('Authorization', `Bearer ${token}`).expect(200);
};
