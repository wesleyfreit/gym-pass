import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from '../../../factories/make-get-user-metrics-use-case';

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(201).send({
    checkInsCount,
  });
};
