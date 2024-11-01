import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app';
import { createAndAuthenticateUser } from '../../../utils/test/register-and-authenticate-user';

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get the user profile', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'jooonhdoeeeeee@gmail.com',
      }),
    );
  });
});
