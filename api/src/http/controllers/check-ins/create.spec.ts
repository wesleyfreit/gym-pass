import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { prisma } from '../../../lib/prisma';
import { createAndAuthenticateUser } from '../../../utils/test/register-and-authenticate-user';

describe('Create Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym Title 1',
        description: 'Gym Description 1',
        phone: '123456789',
        latitude: -6.8862844,
        longitude: -38.5485094,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -6.8862844,
        longitude: -38.5485094,
      });

    expect(response.status).toBe(201);
  });
});
