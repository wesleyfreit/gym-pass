import { type Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { FastifyInstance } from 'fastify';
import request from 'supertest';
import { prisma } from '../../lib/prisma';

const email = 'jooonhdoeeeeee@gmail.com';
const password = '654123';

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  role: Role = 'MEMBER',
) => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email,
      role,
      password_hash: await hash(password, 6),
    },
  });
  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  });

  const { token } = authResponse.body;

  return {
    user,
    token,
  };
};
