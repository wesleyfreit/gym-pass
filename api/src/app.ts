import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { userRoutes } from './http/controllers/users/routes';

export const app = fastify();

app.register(userRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ error: error.message, issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Here I should log to an external monitoring service like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ error: 'Internal server error' });
});
