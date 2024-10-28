import { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { verifyRole } from '../../middlewares/verify-role';
import { create } from './create';
import { nearby } from './nearby';
import { search } from './search';

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);

  app.post('/gyms', { onRequest: [verifyRole('ADMIN')] }, create);
};
