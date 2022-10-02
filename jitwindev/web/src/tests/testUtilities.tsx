import HttpClientCustom from 'network/HttpClientCustom';
import SessionRepository from 'repos/SessionRepository';

export const createSessionRepository = () => {
  const fakeClient: HttpClientCustom = {
    host: 'fake-client-host',
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };
  return new SessionRepository(sessionStorage, fakeClient);
};
