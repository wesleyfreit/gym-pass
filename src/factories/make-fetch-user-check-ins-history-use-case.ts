import { PrismaCheckInsRepository } from '../repositories/prisma/prisma-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from '../use-cases/fetch-user-check-ins-history';

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const prismaCheckInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    prismaCheckInsRepository,
  );

  return fetchUserCheckInsHistoryUseCase;
};
