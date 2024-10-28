import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { gymsRoutes } from './http/controllers/gyms/routes';
import { userRoutes } from './http/controllers/users/routes';
import { checkInsRoutes } from './http/controllers/check-ins/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ error: 'Validation error', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here I should log to an external monitoring service like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ error: 'Internal server error' });
});
