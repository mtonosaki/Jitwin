import { User } from 'models/User';
import { spyOn } from 'jest-mock';
import SessionRepositoryNetwork from './SessionRepositoryNetwork';
import { fakeHttpClient } from '../tests/testUtilities';

describe('Session Repository', () => {
  it('getAuthenticatedUser result is same with setAuthenticatedUser', () => {
    const repos = new SessionRepositoryNetwork(sessionStorage, fakeHttpClient);
    const expectedUser: User = {
      userId: 'sample-oid',
      displayName: 'sample-display-name',
      givenName: 'Sophie',
      userPrincipalName: 'sophie@tomarika.com',
    };
    repos.setAuthenticatedUser(expectedUser);
    expect(repos.getAuthenticatedUser()).toEqual(expectedUser);
  });

  it('isLoginProcess returns setInLoginProcess value', () => {
    const repos = new SessionRepositoryNetwork(sessionStorage, fakeHttpClient);
    expect(repos.isInLoginProcess()).toBeFalsy();

    repos.setInLoginProcess();

    expect(repos.isInLoginProcess()).toBeTruthy();
  });

  it('isLoginProcess returns false when resetInLoginProcess', () => {
    const repos = new SessionRepositoryNetwork(sessionStorage, fakeHttpClient);

    repos.setInLoginProcess();
    repos.resetInLoginProcess();

    expect(repos.isInLoginProcess()).toBeFalsy();
  });

  it('isLoginProcess returns setInLoginProcess value and using session storage', () => {
    const sessionStorageProto = Object.getPrototypeOf(sessionStorage);
    spyOn(sessionStorageProto, 'setItem');
    spyOn(sessionStorageProto, 'getItem');
    spyOn(sessionStorageProto, 'removeItem');

    const repos = new SessionRepositoryNetwork(sessionStorage, fakeHttpClient);
    repos.setInLoginProcess();
    expect(sessionStorageProto.setItem).toHaveBeenCalledWith(
      'InLoginProcess',
      'true'
    );
    expect(sessionStorageProto.setItem).toBeCalledTimes(1);

    repos.isInLoginProcess();
    expect(sessionStorageProto.getItem).toHaveBeenCalledWith('InLoginProcess');
    expect(sessionStorageProto.getItem).toBeCalledTimes(1);

    repos.resetInLoginProcess();
    expect(sessionStorageProto.removeItem).toHaveBeenCalledWith(
      'InLoginProcess'
    );
    expect(sessionStorageProto.removeItem).toBeCalledTimes(1);
  });

  it('logoutSession post blank to logout of backend', () => {
    const sessionRepository = new SessionRepositoryNetwork(
      sessionStorage,
      fakeHttpClient
    );
    sessionRepository.logoutSession();
    expect(fakeHttpClient.post).toHaveBeenCalledWith('/logout');
  });
});
