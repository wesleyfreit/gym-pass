import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '../../../use-cases/errors/user-already-exists-error';
import { RegisterUseCase } from '../../../use-cases/register';

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    await registerUseCase.execute({ name, email, password });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }

    throw error;
  }
};
