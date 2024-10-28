import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

const GYM_LATITUDE = -6.8862844;
const GYM_LONGITUDE = -38.5485094;

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      description: '',
      phone: '',
      latitude: GYM_LATITUDE,
      longitude: GYM_LONGITUDE,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: GYM_LATITUDE,
      userLongitude: GYM_LONGITUDE,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 2, 4, 14, 12, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: GYM_LATITUDE,
      userLongitude: GYM_LONGITUDE,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: GYM_LATITUDE,
        userLongitude: GYM_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 2, 4, 14, 12, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: GYM_LATITUDE,
      userLongitude: GYM_LONGITUDE,
    });

    vi.setSystemTime(new Date(2024, 2, 5, 14, 12, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: GYM_LATITUDE,
      userLongitude: GYM_LONGITUDE,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check-in on distant gym', async () => {
    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -6.8864745,
        userLongitude: -38.5502237,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it('should not be able to check-in on an invalid gym', async () => {
    await expect(
      sut.execute({
        gymId: 'invalid-gym',
        userId: 'user-01',
        userLatitude: GYM_LATITUDE,
        userLongitude: GYM_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
