import SessionRepository from 'repos/SessionRepository';
import { User } from 'models/User';
import { spyOn } from 'jest-mock';

describe('Session Repository', () => {
  it('getAuthenticatedUser result is same with setAuthenticatedUser', () => {
    const repos = new SessionRepository(sessionStorage);
    const expectedUser: User = {
      userId: 'sample-oid',
      displayName: 'sample-display-name',
    };
    repos.setAuthenticatedUser(expectedUser);
    expect(repos.getAuthenticatedUser()).toEqual(expectedUser);
  });

  it('isLoginProcess returns setInLoginProcess value', () => {
    const repos = new SessionRepository(sessionStorage);
    expect(repos.isinLoginProcess()).toBeFalsy();

    repos.setInLoginProcess();

    expect(repos.isinLoginProcess()).toBeTruthy();
  });

  it('isLoginProcess returns false when resetInLoginProcess', () => {
    const repos = new SessionRepository(sessionStorage);

    repos.setInLoginProcess();
    repos.resetInLoginProcess();

    expect(repos.isinLoginProcess()).toBeFalsy();
  });

  it('isLoginProcess returns setInLoginProcess value and using session storage', () => {
    const sessionStorageProto = Object.getPrototypeOf(sessionStorage);
    spyOn(sessionStorageProto, 'setItem');
    spyOn(sessionStorageProto, 'getItem');
    spyOn(sessionStorageProto, 'removeItem');

    const repos = new SessionRepository(sessionStorage);
    repos.setInLoginProcess();
    expect(sessionStorageProto.setItem).toHaveBeenCalledWith(
      'InLoginProcess',
      'true'
    );
    expect(sessionStorageProto.setItem).toBeCalledTimes(1);

    repos.isinLoginProcess();
    expect(sessionStorageProto.getItem).toHaveBeenCalledWith('InLoginProcess');
    expect(sessionStorageProto.getItem).toBeCalledTimes(1);

    repos.resetInLoginProcess();
    expect(sessionStorageProto.removeItem).toHaveBeenCalledWith(
      'InLoginProcess'
    );
    expect(sessionStorageProto.removeItem).toBeCalledTimes(1);
  });
});
