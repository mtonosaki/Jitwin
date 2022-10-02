import React, { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from 'pages/HomePage';
import SessionRepository from 'repos/SessionRepository';
import { RecoilRoot } from 'recoil';
import { TestIds } from '../tests/TestIds';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

jest.mock('repos/SessionRepository');

const mockNavigateSpy = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateSpy,
}));

const locationHrefSpy = jest.fn();

function HomePageAuthedWrapper() {
  const [, setAuthenticatedUser] = useAuthenticatedUser();
  useEffect(() => {
    setAuthenticatedUser({
      userId: '111-22-333',
      displayName: 'Sophie Brown',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HomePage />;
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

  describe('Login', () => {
    const getLoginButton = () =>
      screen.getByRole('button', { name: /Start Jitwin/ });

    describe('System', () => {
      it('Given development environment, when click login button, link url starts with http://localhost:8080', () => {
        process.env.REACT_APP_NODE_ENV = 'development';
        render(
          <RecoilRoot>
            <HomePage />
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
            <HomePage />
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
            <HomePage />
          </RecoilRoot>
        );

        expect(
          screen.getByRole('img', { name: 'login-icon' })
        ).toBeInTheDocument();
        const loginButton = getLoginButton();
        expect(loginButton).toBeInTheDocument();
      });

      describe('Before login', () => {
        beforeEach(() => {
          const stubGetAuthenticatedUser = jest.fn();
          (SessionRepository as jest.Mock).mockClear();
          (SessionRepository as jest.Mock).mockImplementation(() => ({
            getAuthenticatedUser: stubGetAuthenticatedUser,
          }));
          stubGetAuthenticatedUser.mockReturnValue(undefined);
        });

        it('Sophie can not see her name', () => {
          render(
            <RecoilRoot>
              <HomePage />
            </RecoilRoot>
          );
          expect(
            screen.queryByTestId(TestIds.PAGE_HOME_DISPLAY_NAME)
          ).not.toBeInTheDocument();
        });

        it('When click login button, Sophie can see Menu page', () => {
          const spySetInLoginProcess = jest.fn();
          (SessionRepository as jest.Mock).mockClear();
          (SessionRepository as jest.Mock).mockImplementation(() => ({
            setInLoginProcess: spySetInLoginProcess,
          }));
          render(
            <RecoilRoot>
              <HomePage />
            </RecoilRoot>
          );
          expect(spySetInLoginProcess).not.toHaveBeenCalled();

          const loginButton = getLoginButton();
          fireEvent.click(loginButton);

          expect(spySetInLoginProcess).toHaveBeenCalled();
        });
      });

      describe('After login', () => {
        it('Sophie can see her name', () => {
          render(
            <RecoilRoot>
              <HomePageAuthedWrapper />
            </RecoilRoot>
          );
          expect(
            screen.getByTestId(TestIds.PAGE_HOME_DISPLAY_NAME)
          ).toBeInTheDocument();
          expect(screen.getByText('Sophie Brown')).toBeInTheDocument();
        });

        it('Sophie can see menu page', () => {
          render(
            <RecoilRoot>
              <HomePageAuthedWrapper />
            </RecoilRoot>
          );
          const startButton = getLoginButton();
          fireEvent.click(startButton);

          expect(mockNavigateSpy).toHaveBeenCalledWith('/111-22-333/Menu');
        });

        describe('Sophie sees Menu page automatically', () => {
          const stubIsinLoginProcess = jest.fn();
          const spyResetInLoginProcess = jest.fn();
          beforeEach(() => {
            stubIsinLoginProcess.mockClear();
            (SessionRepository as jest.Mock).mockClear();
            (SessionRepository as jest.Mock).mockImplementation(() => ({
              isinLoginProcess: stubIsinLoginProcess,
              resetInLoginProcess: spyResetInLoginProcess,
            }));
          });
          it('when in login process', () => {
            stubIsinLoginProcess.mockReturnValue(true);

            render(
              <RecoilRoot>
                <HomePageAuthedWrapper />
              </RecoilRoot>
            );

            expect(mockNavigateSpy).toHaveBeenCalledWith('/111-22-333/Menu');
            expect(spyResetInLoginProcess).toHaveBeenCalled();
          });

          it('but not so because of not in login process', () => {
            stubIsinLoginProcess.mockReturnValue(false);

            render(
              <RecoilRoot>
                <HomePageAuthedWrapper />
              </RecoilRoot>
            );

            expect(mockNavigateSpy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
