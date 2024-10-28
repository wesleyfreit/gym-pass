import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeRegisterUseCase } from '../../../factories/make-register-use-case';
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(3),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ name, email, password });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }
};
