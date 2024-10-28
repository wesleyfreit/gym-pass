import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserProfileUseCase } from '../../../factories/make-get-user-profile-use-case';
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error';

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfileUseCase();

  try {
    const { user } = await getUserProfile.execute({
      userId: request.user.sub,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...authenticatedUser } = user;

    return reply.status(200).send({
      user: authenticatedUser,
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
};
