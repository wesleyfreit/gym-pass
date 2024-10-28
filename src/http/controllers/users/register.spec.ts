import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe('Register Controller (e2e)', { timeout: 10000 }, () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register an user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jooonhdoeeeeee@gmail.com',
      password: '654123',
    });

    expect(response.status).toBe(201);
  });
});
