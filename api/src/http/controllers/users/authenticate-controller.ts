import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeAuthenticateUseCase } from '../../../factories/make-login-use-case';
import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error';

export const authenticateController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBodySchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({ email, password });

    return reply.status(200).send();
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ error: error.message });
    }

    throw error;
  }
};
