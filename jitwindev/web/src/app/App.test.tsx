import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersRepositoryBackend from 'repos/UsersRepositoryBackend';
import App from 'app/App';
import { RecoilRoot } from 'recoil';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import HomePage from 'pages/HomePage';
import { useAuthenticateStatus } from 'hooks/useAuthenticateStatus';

jest.mock('repos/UsersRepositoryBackend');
jest.mock('Pages/HomePage');

const expectedUser = {
  oid: 'oid-1111-2222-xxxx',
  displayName: 'Sophie Brown',
};

function WrapperAppAndDisplayName() {
  const [authenticatedUser] = useAuthenticatedUser();
  const [authenticateStatus] = useAuthenticateStatus();
  return (
    <div>
      <div data-testid="displayName">
        {authenticatedUser?.displayName ?? '(undefined displayName)'}
      </div>
      <div data-testid="authenticateStatus">{authenticateStatus}</div>
      <App />
    </div>
  );
}

describe('Auth System', () => {
  describe('Authenticate Status', () => {
    beforeEach(() => {
      (HomePage as jest.Mock).mockReturnValue(<div>FakeHomePage</div>);
    });

    it('When confirming, status become waiting', async () => {
      (UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
        getMe: () =>
          new Promise<{ displayName: string; userId: string }>((r, e) => {}),
      }));

      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <WrapperAppAndDisplayName />
            </MemoryRouter>
          </RecoilRoot>
        );
      });

      const status = within(screen.getByTestId('authenticateStatus'));
      expect(status.getByText('waiting')).toBeInTheDocument();
    });

    it('When success, status become confirmed', async () => {
      (UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
        getMe: () => Promise.resolve({ userId: '11', displayName: 'aaa' }),
      }));

      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <WrapperAppAndDisplayName />
            </MemoryRouter>
          </RecoilRoot>
        );
      });

      const status = within(screen.getByTestId('authenticateStatus'));
      expect(status.getByText('confirmed')).toBeInTheDocument();
    });

    it('When error, status become error', async () => {
      (UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
        getMe: () => Promise.reject(),
      }));

      await act(async () => {
        await render(
          <RecoilRoot>
            <MemoryRouter initialEntries={['/']}>
              <WrapperAppAndDisplayName />
            </MemoryRouter>
          </RecoilRoot>
        );
      });

      const status = within(screen.getByTestId('authenticateStatus'));
      expect(status.getByText('error')).toBeInTheDocument();
    });
  });

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
