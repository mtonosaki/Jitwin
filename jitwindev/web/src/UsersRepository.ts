import { User } from 'User';

export interface UsersRepository {
  getMe(): Promise<User>;
}
