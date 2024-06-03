import { PrismaGymsRepository } from '../repositories/prisma/prisma-gyms-repository';
import { SearchGymsUseCase } from '../use-cases/search-gyms';

export const makeSearchGymsUseCase = () => {
  const prismaGymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository);

  return searchGymsUseCase;
};
