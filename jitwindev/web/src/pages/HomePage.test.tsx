import React, { useEffect } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HomePage from 'pages/HomePage';
import SessionRepository from 'repos/SessionRepository';
import { RecoilRoot } from 'recoil';
import { TestIds } from '../tests/TestIds';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { useAuthenticateStatus } from '../hooks/useAuthenticateStatus';
import { makeMockSessionRepository } from '../tests/testUtilities';

const mockSpyNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
}));

const locationHrefSpy = jest.fn();

type WrapperProps = {
  sessionRepository: SessionRepository;
};

function HomePageAuthedWrapper({ sessionRepository }: WrapperProps) {
  const [, setAuthenticatedUser] = useAuthenticatedUser();
  useEffect(() => {
    setAuthenticatedUser({
      userId: '2222-test-home-page-3333',
      displayName: 'Sophie Brown',
      userPrincipalName: 'sophie@tomarika.com',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HomePage sessionRepository={sessionRepository} />;
}

describe('HomePage', () => {
  beforeEach(() => {
    // @ts-ignore
    delete window.location;
    window.location = {} as any;
    Object.defineProperty(window.location, 'href', {
      set: locationHrefSpy,
    });
  });

  describe('WaitingSpinner', () => {
    it('Sophie can see waiting spinner', () => {
      render(
        <RecoilRoot>
          <HomePage sessionRepository={makeMockSessionRepository()} />
        </RecoilRoot>
      );

      expect(screen.getByTestId(TestIds.WAITING_SPINNER)).toBeInTheDocument();
    });
    it('When auth error, hide waiting spinner', async () => {
      function WrapperAuthErrorHome() {
        const [, setStatus] = useAuthenticateStatus();
        useEffect(() => {
          setStatus('error');
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <HomePage sessionRepository={makeMockSessionRepository()} />;
      }

      await act(async () => {
        await render(
          <RecoilRoot>
            <WrapperAuthErrorHome />
          </RecoilRoot>
        );
      });

      expect(
        screen.queryByTestId(TestIds.WAITING_SPINNER)
      ).not.toBeInTheDocument();
    });
  });

  describe('Login', () => {
    const getLoginButton = () =>
      screen.getByRole('button', { name: /Start Jitwin/ });

    describe('System', () => {
      it('Given development environment, when click login button, link url starts with http://localhost:8080', () => {
        process.env.REACT_APP_NODE_ENV = 'development';
        render(
          <RecoilRoot>
            <HomePage sessionRepository={makeMockSessionRepository()} />
          </RecoilRoot>
        );

        const loginButton = getLoginButton();
        fireEvent.click(loginButton);

        expect(locationHrefSpy).toHaveBeenCalledWith(
          'http://localhost:8080/oauth2/authorization/graph'
        );
      });

      it('Given production mode, when click login button, link url starts with /', () => {
        process.env.REACT_APP_NODE_ENV = 'production';
        render(
          <RecoilRoot>
            <HomePage sessionRepository={makeMockSessionRepository()} />
          </RecoilRoot>
        );

        const loginButton = getLoginButton();
        fireEvent.click(loginButton);

        expect(locationHrefSpy).toHaveBeenCalledWith(
          '/oauth2/authorization/graph'
        );
      });
    });

    describe('Behavior', () => {
      it('Show login button', () => {
        render(
          <RecoilRoot>
            <HomePage sessionRepository={makeMockSessionRepository()} />
          </RecoilRoot>
        );

        expect(
          screen.getByRole('img', { name: 'login-icon' })
        ).toBeInTheDocument();
        const loginButton = getLoginButton();
        expect(loginButton).toBeInTheDocument();
      });

      describe('Before login', () => {
        const sessionRepository = makeMockSessionRepository();
        beforeEach(() => {
          const stubGetAuthenticatedUser = jest.fn();
          stubGetAuthenticatedUser.mockReturnValue(undefined);
          sessionRepository.getAuthenticatedUser = stubGetAuthenticatedUser;
        });

        it('Sophie can not see her name', () => {
          render(
            <RecoilRoot>
              <HomePage sessionRepository={sessionRepository} />
            </RecoilRoot>
          );
          expect(
            screen.queryByTestId(TestIds.PAGE_HOME_DISPLAY_NAME)
          ).not.toBeInTheDocument();
        });

        it('When click login button, Sophie can see Menu page', () => {
          const spySetInLoginProcess = jest.fn();
          sessionRepository.setInLoginProcess = spySetInLoginProcess;

          render(
            <RecoilRoot>
              <HomePage sessionRepository={sessionRepository} />
            </RecoilRoot>
          );
          expect(spySetInLoginProcess).not.toHaveBeenCalled();

          const loginButton = getLoginButton();
          fireEvent.click(loginButton);

          expect(spySetInLoginProcess).toHaveBeenCalled();
        });

        it('Sophie can not see logout button', () => {
          render(
            <RecoilRoot>
              <HomePage sessionRepository={sessionRepository} />
            </RecoilRoot>
          );
          expect(
            screen.queryByRole('button', { name: 'logout' })
          ).not.toBeInTheDocument();
        });
      });

      describe('After login', () => {
        it('Sophie can see her name', () => {
          render(
            <RecoilRoot>
              <HomePageAuthedWrapper
                sessionRepository={makeMockSessionRepository()}
              />
            </RecoilRoot>
          );
          expect(
            screen.getByTestId(TestIds.PAGE_HOME_DISPLAY_NAME)
          ).toBeInTheDocument();
          expect(screen.getByText('Sophie Brown')).toBeInTheDocument();
        });

        it('Sophie can see logout link', () => {
          render(
            <RecoilRoot>
              <HomePageAuthedWrapper
                sessionRepository={makeMockSessionRepository()}
              />
            </RecoilRoot>
          );
          const logoutButton = screen.getByRole('button', { name: 'logout' });

          expect(
            screen.getByText('if you are not Sophie Brown,')
          ).toBeInTheDocument();
          expect(screen.getByText('first.')).toBeInTheDocument();
          expect(screen.getByText('logout')).toBeInTheDocument();
          expect(logoutButton).toBeInTheDocument();
        });

        it('Sophie can logout', async () => {
          const spyLogoutSession = jest.fn();
          const sessionRepository = makeMockSessionRepository();
          sessionRepository.logoutSession = spyLogoutSession;

          render(
            <RecoilRoot>
              <HomePageAuthedWrapper sessionRepository={sessionRepository} />
            </RecoilRoot>
          );
          const logoutButton = screen.getByRole('button', { name: 'logout' });

          await act(async () => {
            fireEvent.click(logoutButton);
          });

          expect(spyLogoutSession).toHaveBeenCalled();
          expect(locationHrefSpy).toHaveBeenCalledWith('/');
        });

        it('Sophie can see menu page', () => {
          render(
            <RecoilRoot>
              <HomePageAuthedWrapper
                sessionRepository={makeMockSessionRepository()}
              />
            </RecoilRoot>
          );
          const startButton = getLoginButton();
          fireEvent.click(startButton);

          expect(mockSpyNavigate).toHaveBeenCalledWith(
            '/2222-test-home-page-3333/stage',
            { replace: true }
          );
        });

        describe('Sophie sees Menu page automatically', () => {
          const sessionRepository = makeMockSessionRepository();
          const stubIsinLoginProcess = jest.fn();
          const spyResetInLoginProcess = jest.fn();

          beforeEach(() => {
            stubIsinLoginProcess.mockClear();
            spyResetInLoginProcess.mockClear();
            sessionRepository.isInLoginProcess = stubIsinLoginProcess;
            sessionRepository.resetInLoginProcess = spyResetInLoginProcess;
          });

          it('when in login process', () => {
            stubIsinLoginProcess.mockReturnValue(true);

            render(
              <RecoilRoot>
                <HomePageAuthedWrapper sessionRepository={sessionRepository} />
              </RecoilRoot>
            );

            expect(mockSpyNavigate).toHaveBeenCalledWith(
              '/2222-test-home-page-3333/Menu',
              { replace: true }
            );
            expect(spyResetInLoginProcess).toHaveBeenCalled();
          });

          it('but not so because of not in login process', () => {
            stubIsinLoginProcess.mockReturnValue(false);

            render(
              <RecoilRoot>
                <HomePageAuthedWrapper sessionRepository={sessionRepository} />
              </RecoilRoot>
            );

            expect(mockSpyNavigate).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
