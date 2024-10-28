import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeValidateCheckInUseCase } from '../../../factories/make-validate-check-in-use-case';
import { LateCheckInValidationError } from '../../../use-cases/errors/late-check-in-validation-error';
import { ResourceNotFoundError } from '../../../use-cases/errors/resource-not-found-error';

export const validate = async (request: FastifyRequest, reply: FastifyReply) => {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  try {
    await validateCheckInUseCase.execute({
      checkInId,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof LateCheckInValidationError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
};
