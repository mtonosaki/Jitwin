import SessionRepository from 'repos/SessionRepository';
import { User } from 'models/User';
import { spyOn } from 'jest-mock';
import { createSessionRepository } from 'tests/testUtilities';
import HttpClientCustom from '../network/HttpClientCustom';

describe('Session Repository', () => {
  it('getAuthenticatedUser result is same with setAuthenticatedUser', () => {
    const repos = createSessionRepository();
    const expectedUser: User = {
      userId: 'sample-oid',
      displayName: 'sample-display-name',
    };
    repos.setAuthenticatedUser(expectedUser);
    expect(repos.getAuthenticatedUser()).toEqual(expectedUser);
  });

  it('isLoginProcess returns setInLoginProcess value', () => {
    const repos = createSessionRepository();
    expect(repos.isInLoginProcess()).toBeFalsy();

    repos.setInLoginProcess();

    expect(repos.isInLoginProcess()).toBeTruthy();
  });

  it('isLoginProcess returns false when resetInLoginProcess', () => {
    const repos = createSessionRepository();

    repos.setInLoginProcess();
    repos.resetInLoginProcess();

    expect(repos.isInLoginProcess()).toBeFalsy();
  });

  it('isLoginProcess returns setInLoginProcess value and using session storage', () => {
    const sessionStorageProto = Object.getPrototypeOf(sessionStorage);
    spyOn(sessionStorageProto, 'setItem');
    spyOn(sessionStorageProto, 'getItem');
    spyOn(sessionStorageProto, 'removeItem');

    const repos = createSessionRepository();
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
    const spyPost = jest.fn();
    const spyClient: HttpClientCustom = {
      host: 'dummy-host-session-repos-test',
      post: spyPost,
      get: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    };
    const sessionRepository = new SessionRepository(sessionStorage, spyClient);

    sessionRepository.logoutSession();

    expect(spyPost).toHaveBeenCalledWith('/logout');
  });
});
