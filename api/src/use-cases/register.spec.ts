import { compare } from 'bcrypt';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'Mattz Khanx',
      email: 'mattzkhanx@gmail.com',
      password: '654123',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const password = '654123';

    const { user } = await sut.execute({
      name: 'Mattz Khanx',
      email: 'mattzkhanx@gmail.com',
      password,
    });

    const isPasswordCorrectlyHashed = await compare(password, user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register a user with an already registered email', async () => {
    const email = 'mattzkhanx@gmail.com';

    await sut.execute({
      name: 'Mattz Khanx',
      email,
      password: '654123',
    });

    await expect(() =>
      sut.execute({
        name: 'Mattz Khanx',
        email,
        password: '654123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
