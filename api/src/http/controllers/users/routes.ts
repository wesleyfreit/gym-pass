import { FastifyInstance } from 'fastify';
import { registerController } from './register-controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController);
};
