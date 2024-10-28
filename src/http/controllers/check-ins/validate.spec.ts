import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { prisma } from '../../../lib/prisma';
import { createAndAuthenticateUser } from '../../../utils/test/register-and-authenticate-user';

describe('Validate Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check-in', async () => {
    const { user, token } = await createAndAuthenticateUser(app, 'ADMIN');

    const gym = await prisma.gym.create({
      data: {
        title: 'Gym Title 1',
        description: 'Gym Description 1',
        phone: '123456789',
        latitude: -6.8862844,
        longitude: -38.5485094,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
