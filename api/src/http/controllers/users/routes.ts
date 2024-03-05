import { FastifyInstance } from 'fastify';
import { registerController } from './register-controller';
import { authenticateController } from './authenticate-controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController);
  app.post('/sessions', authenticateController);
};
