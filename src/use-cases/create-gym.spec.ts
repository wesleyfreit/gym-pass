import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to register a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym 01',
      description: null,
      phone: null,
      latitude: -6.8862844,
      longitude: -38.5485094,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
