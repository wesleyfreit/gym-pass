import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

const GYM_LATITUDE = -6.8862844;
const GYM_LONGITUDE = -38.5485094;

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym 01',
      description: null,
      phone: null,
      latitude: GYM_LATITUDE,
      longitude: GYM_LONGITUDE,
    });

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Gym 02',
      description: null,
      phone: null,
      latitude: GYM_LATITUDE,
      longitude: GYM_LONGITUDE,
    });

    const { gyms } = await sut.execute({
      query: 'Gym 01',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ id: 'gym-01', title: 'Gym 01' })]);
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `Gym ${1}`,
        description: null,
        phone: null,
        latitude: GYM_LATITUDE,
        longitude: GYM_LONGITUDE,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        id: 'gym-21',
      }),
      expect.objectContaining({
        id: 'gym-22',
      }),
    ]);
  });
});
