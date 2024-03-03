import bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExists } from './errors/user-already-exists-error';

interface RegisterUseCaseProps {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseProps) {
    const password_hash = await bcrypt.hash(password, 10);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }

    await this.usersRepository.create({ name, email, password_hash });
  }
}
