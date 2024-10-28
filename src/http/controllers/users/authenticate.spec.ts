import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';

describe('Authenticate Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate an user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jooonhdoeeeeee@gmail.com',
      password: '654123',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'jooonhdoeeeeee@gmail.com',
      password: '654123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });
});
