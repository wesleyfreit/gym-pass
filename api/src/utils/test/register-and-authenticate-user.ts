import { FastifyInstance } from 'fastify';
import request from 'supertest';

const email = 'jooonhdoeeeeee@gmail.com';
const password = '654123';

export const createAndAuthenticateUser = async (app: FastifyInstance) => {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email,
    password,
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  });

  const { token } = authResponse.body;

  return {
    token,
  };
};
