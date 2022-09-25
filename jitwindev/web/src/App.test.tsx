import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersRepositoryBackend from 'UsersRepositoryBackend';
import SessionRepository from 'SessionRepository';
import App from 'App';

jest.mock('UsersRepositoryBackend');
jest.mock('SessionRepository');

describe('Auth System', () => {
  describe('Authenticated', () => {
    const stubSetAuthenticatedUser = jest.fn();
    const expectedUser = {
      oid: 'oid-1111-2222-xxxx',
      displayName: 'Sophie Brown',
    };
    let getMeCallCounter = 0;

    beforeEach(() => {
      getMeCallCounter = 0;

      (UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
        getMe: () => {
          getMeCallCounter += 1;
          return Promise.resolve(expectedUser);
        },
      }));

      (SessionRepository as jest.Mock).mockImplementation(() => ({
        setAuthenticatedUser: stubSetAuthenticatedUser,
        getAuthenticatedUser: jest.fn(),
      }));
    });
    it('When render, call /me only one time', async () => {
      await render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(getMeCallCounter).toBe(1);
    });

    it('After /me, set the user information to sessionRepository', async () => {
      await render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(stubSetAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(stubSetAuthenticatedUser).toHaveBeenCalledWith(expectedUser);
    });
  });
});
