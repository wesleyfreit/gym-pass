import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

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
      latitude: -6.8862844,
      longitude: -38.5485094,
    });

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Gym 02',
      description: null,
      phone: null,
      latitude: -6.8862844,
      longitude: -38.5485094,
    });

    const { gyms } = await sut.execute({
      search: 'Gym 01',
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
        latitude: -6.8862844,
        longitude: -38.5485094,
      });
    }

    const { gyms } = await sut.execute({
      search: 'Gym',
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
