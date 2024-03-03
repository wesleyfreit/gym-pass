import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { prisma } from '../../../lib/prisma';

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const password_hash = await bcrypt.hash(password, 10);

  const userWithSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    return reply.status(409).send({
      error: 'Email already in use.',
    });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });

  return reply.status(201).send();
};
