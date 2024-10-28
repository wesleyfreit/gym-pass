import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe('Refresh Token Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh the auth token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jooonhdoeeeeee@gmail.com',
      password: '654123',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'jooonhdoeeeeee@gmail.com',
      password: '654123',
    });

    const cookies = authResponse.get('Set-Cookie') ?? [];

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });

    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
