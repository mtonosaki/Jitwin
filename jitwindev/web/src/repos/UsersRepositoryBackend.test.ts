import UsersRepositoryBackend from './UsersRepositoryBackend';
import HttpClientCustom from '../network/HttpClientCustom';
import { User } from '../models/User';

jest.mock('../network/HttpClientCustom');

describe('UsersRepositoryBackend', () => {
  const stubSpyGet = jest.fn();
  beforeEach(() => {
    stubSpyGet.mockClear();
    (HttpClientCustom as any).mockClear();
    (HttpClientCustom as any).mockImplementation(() => ({
      get: stubSpyGet,
    }));
  });

  it('getMe uses httpClient to access to GraphApi', async () => {
    const repos = new UsersRepositoryBackend(new HttpClientCustom('/dummy'));

    await repos.getMe();

    expect(stubSpyGet).toHaveBeenCalledWith('/users/me');
  });

  it('getMe returns GraphApi me via httpClient', async () => {
    const expectedUser: User = {
      userId: '8888-1223-8282',
      displayName: 'Taro Micro',
    };
    stubSpyGet.mockResolvedValue(expectedUser);
    const repos = new UsersRepositoryBackend(new HttpClientCustom('/dummy'));

    const me = await repos.getMe();

    expect(me.userId).toEqual(expectedUser.userId);
    expect(me.displayName).toEqual(expectedUser.displayName);
  });
});
