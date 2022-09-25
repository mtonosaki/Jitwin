import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersRepositoryBackend from 'UsersRepositoryBackend';
import App from 'App';
import { RecoilRoot } from 'recoil';
import { useAuthenticatedUser } from 'useAuthenticatedUser';
import HomePage from './Pages/HomePage';

jest.mock('UsersRepositoryBackend');
jest.mock('Pages/HomePage');

const expectedUser = {
  oid: 'oid-1111-2222-xxxx',
  displayName: 'Sophie Brown',
};

describe('Auth System', () => {
  describe('Authenticated', () => {
    let getMeCallCounter = 0;

    beforeEach(() => {
      getMeCallCounter = 0;

      (UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
        getMe: () => {
          getMeCallCounter += 1;
          return Promise.resolve(expectedUser);
        },
      }));

      (HomePage as jest.Mock).mockReturnValue(<div>FakeHomePage</div>);
    });

    it('When render, call /me only one time', async () => {
      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <App />
            </MemoryRouter>
          </RecoilRoot>
        );
      });
      expect(getMeCallCounter).toBe(1);
    });

    it('After call /me, set the user information to authenticatedUser', async () => {
      function AppWrapperDisplayName() {
        const [authenticatedUser] = useAuthenticatedUser();
        return (
          <div>
            <div>
              {authenticatedUser?.displayName ?? '(undefined displayName)'}
            </div>
            <App />
          </div>
        );
      }
      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <AppWrapperDisplayName />
            </MemoryRouter>
          </RecoilRoot>
        );
      });
      expect(screen.getByText(expectedUser.displayName)).toBeInTheDocument();
    });
  });
});
