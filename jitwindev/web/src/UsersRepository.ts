import { User } from 'User';
import { HttpClient } from 'CustomHttpClient';

export interface UsersRepository {
  getMe(): Promise<User>;
}

export class BackendApiUsersRepository implements UsersRepository {
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getMe = async () => {
    const responseJson = await this.httpClient.get('/users/me');
    return responseJson as User;
  };
}
