import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verify-jwt';
import { authenticateController } from './authenticate-controller';
import { profile } from './profile-controller';
import { registerController } from './register-controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
};
