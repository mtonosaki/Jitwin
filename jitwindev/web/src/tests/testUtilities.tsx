import HttpClientCustom from 'network/HttpClientCustom';
import SessionRepository from '../repos/SessionRepository';

export const fakeHttpClient: HttpClientCustom = {
  host: 'fake-client-host',
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

export function makeMockSessionRepository(): SessionRepository {
  return {
    setInLoginProcess: jest.fn(),
    resetInLoginProcess: jest.fn(),
    isInLoginProcess: jest.fn(),
    logoutSession: jest.fn(),
  };
}
