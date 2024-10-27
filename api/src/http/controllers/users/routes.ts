import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { authenticate } from './authenticate';
import { profile } from './profile';
import { register } from './register';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
};
