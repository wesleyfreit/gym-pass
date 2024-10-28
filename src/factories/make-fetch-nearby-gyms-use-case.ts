import { PrismaGymsRepository } from '../repositories/prisma/prisma-gyms-repository';
import { FetchNearbyGymsUseCase } from '../use-cases/fetch-nearby-gyms';

export const makeFetchNearbyGymsUseCase = () => {
  const prismaGymsRepository = new PrismaGymsRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(prismaGymsRepository);

  return fetchNearbyGymsUseCase;
};
