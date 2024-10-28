import { FastifyReply, FastifyRequest } from 'fastify';

export const verifyRole = (roleToVerify: 'ADMIN' | 'MEMBER') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user.role;

    if (userRole !== roleToVerify) {
      return reply.status(403).send({ message: 'Forbidden' });
    }
  };
};
