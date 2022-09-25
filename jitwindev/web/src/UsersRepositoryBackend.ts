import { User } from 'User';
import HttpClientCustom from 'HttpClientCustom';
import { UsersRepository } from 'UsersRepository';

export default class UsersRepositoryBackend implements UsersRepository {
  private readonly httpClient: HttpClientCustom;

  constructor(httpClient: HttpClientCustom) {
    this.httpClient = httpClient;
  }

  getMe = async () => {
    const responseJson = await this.httpClient.get('/users/me');
    return responseJson as User;
  };
}
