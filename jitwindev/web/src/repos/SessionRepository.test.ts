import SessionRepository from 'repos/SessionRepository';

describe('Session Repository', () => {
  it('getAuthenticatedUser result is same with setAuthenticatedUser', () => {
    const repos = new SessionRepository();
    const expectedUser = {
      oid: 'sample-oid',
      displayName: 'sample-display-name',
    };
    repos.setAuthenticatedUser(expectedUser);
    expect(repos.getAuthenticatedUser()).toEqual(expectedUser);
  });
});
