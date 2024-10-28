import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeCheckInUseCase } from '../../../factories/make-check-in-use-case';
import { MaxDistanceError } from '../../../use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '../../../use-cases/errors/max-number-of-checkins-error';
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error';

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const createCheckInUseCase = makeCheckInUseCase();

  try {
    await createCheckInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof MaxDistanceError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    if (error instanceof MaxNumberOfCheckInsError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
};
