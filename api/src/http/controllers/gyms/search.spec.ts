import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createGyms } from '../../../utils/test/create-gyms';
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

    await createGyms(app, token);

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Gym Title 1',
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.gyms).toHaveLength(1);

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym Title 1',
      }),
    ]);
  });
});
