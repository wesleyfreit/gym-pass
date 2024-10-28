import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { prisma } from '../../../lib/prisma';
import { createAndAuthenticateUser } from '../../../utils/test/register-and-authenticate-user';

describe('Search Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app);

    await prisma.gym.create({
      data: {
        title: 'Gym Title',
        description: 'Gym Description',
        phone: '123456789',
        latitude: -6.8862844,
        longitude: -38.5485094,
      },
    });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Gym Title',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.gyms).toHaveLength(1);

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Title',
      }),
    ]);
  });
});
