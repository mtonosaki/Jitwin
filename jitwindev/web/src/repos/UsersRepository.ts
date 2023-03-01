import { User } from 'models/User'

export interface UsersRepository {
  getMe(): Promise<User>
}
