import { User } from 'models/User';
import HttpClientCustom from 'network/HttpClientCustom';
import { UsersRepository } from 'repos/UsersRepository';

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
