import { Gym } from '@prisma/client';
import { GymsRepository } from '../gyms-repositort';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((user) => user.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
