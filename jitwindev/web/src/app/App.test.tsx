import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersRepositoryBackend from 'repos/UsersRepositoryBackend';
import App from 'app/App';
import { RecoilRoot } from 'recoil';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import HomePage from '../pages/HomePage';

jest.mock('repos/UsersRepositoryBackend');
jest.mock('Pages/HomePage');

const expectedUser = {
  oid: 'oid-1111-2222-xxxx',
  displayName: 'Sophie Brown',
};

function WrapperAppAndDisplayName() {
  const [authenticatedUser] = useAuthenticatedUser();
  return (
    <div>
      <div>{authenticatedUser?.displayName ?? '(undefined displayName)'}</div>
      <App />
    </div>
  );
}

describe('Auth System', () => {
  describe('Authenticated', () => {
    let getMeCallCounter = 0;

    beforeEach(() => {
      getMeCallCounter = 0;
      (UsersRepositoryBackend as jest.Mock).mockClear();
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
      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <div data-testid="testing-wrapper-app-and-display-name">
                <WrapperAppAndDisplayName />
              </div>
            </MemoryRouter>
          </RecoilRoot>
        );
      });
      expect(
        within(
          screen.getByTestId('testing-wrapper-app-and-display-name')
        ).getByText(expectedUser.displayName)
      ).toBeInTheDocument();
    });
  });
});
