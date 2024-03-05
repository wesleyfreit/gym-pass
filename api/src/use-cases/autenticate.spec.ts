import { hash } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate', async () => {
    const email = 'mattzkhanx@gmail.com';
    const password = '654123';

    await usersRepository.create({
      name: 'Mattz Khanx',
      email,
      password_hash: await hash(password, 6),
    });

    const { user } = await sut.execute({
      email,
      password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'mattzkhanx@gmail.com',
        password: '654123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'mattzkhanx@gmail.com';

    await usersRepository.create({
      name: 'Mattz Khanx',
      email,
      password_hash: await hash('654123', 6),
    });

    await expect(() =>
      sut.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
