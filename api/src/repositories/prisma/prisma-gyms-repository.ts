import { type Gym, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async searchMany(search: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * 
      FROM gyms 
      WHERE (
        6371 * acos( 
          cos( 
            radians(${latitude}) 
          ) * cos( 
            radians( latitude ) 
          ) * cos( radians( longitude ) - radians(${longitude}) ) * sin( radians( latitude ) ) ) 
      ) <= 10`;

    return gyms;
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }
}
