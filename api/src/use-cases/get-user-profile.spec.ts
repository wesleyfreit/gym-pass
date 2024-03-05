import { hash } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const userCreated = await usersRepository.create({
      name: 'Mattz Khanx',
      email: 'mattzkhanx@gmail.com',
      password_hash: await hash('654123', 6),
    });

    const { user } = await sut.execute({ userId: userCreated.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual(userCreated.name);
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
