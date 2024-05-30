import { FastifyInstance } from 'fastify';
import { authenticateController } from './authenticate-controller';
import { registerController } from './register-controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);
};
