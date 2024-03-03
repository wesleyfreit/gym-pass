import { FastifyInstance } from 'fastify';
import { register } from './register.controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', register);
};
