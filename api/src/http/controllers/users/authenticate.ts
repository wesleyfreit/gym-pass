import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeAuthenticateUseCase } from '../../../factories/make-authenticate-use-case';
import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authenticateBodySchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({
        error: error.message,
      });
    }

    throw error;
  }
};
