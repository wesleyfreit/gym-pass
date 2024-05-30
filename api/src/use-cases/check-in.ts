import { type CheckIn } from '@prisma/client';
import { CheckInsRepository } from '../repositories/check-ins-repository';
import { GymsRepository } from '../repositories/gyms-repositort';
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  private checkInsRepository: CheckInsRepository;
  private gymsRepository: GymsRepository;
  private readonly MAX_DISTANCE_IN_KILOMETERS = 0.1;

  constructor(checkInsRepository: CheckInsRepository, gymsRepository: GymsRepository) {
    this.checkInsRepository = checkInsRepository;
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    if (distance > this.MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new Error('User already checked in today');
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}
