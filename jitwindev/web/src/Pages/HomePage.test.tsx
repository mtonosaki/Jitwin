import React, { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from 'Pages/HomePage';
import SessionRepository from 'SessionRepository';
import { RecoilRoot } from 'recoil';
import { TestIds } from '../tests/TestIds';
import { useAuthenticatedUser } from '../useAuthenticatedUser';

jest.mock('SessionRepository');

describe('HomePage', () => {
  describe('Login', () => {
    const getLoginButton = () =>
      screen.getByRole('button', { name: /Start Jitwin/ });

    describe('System', () => {
      const locationHrefSpy = jest.fn();
      beforeEach(() => {
        // @ts-ignore
        delete window.location;
        window.location = {} as any;
        Object.defineProperty(window.location, 'href', {
          set: locationHrefSpy,
        });
      });

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
      });

      describe('After login', () => {
        function HomePageWrapper() {
          const [, setAuthenticatedUser] = useAuthenticatedUser();
          useEffect(() => {
            setAuthenticatedUser({
              oid: '111-22-333',
              displayName: 'Sophie Brown',
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, []);
          return <HomePage />;
        }
        it('Sophie can see her name', () => {
          render(
            <RecoilRoot>
              <HomePageWrapper />
            </RecoilRoot>
          );
          expect(
            screen.getByTestId(TestIds.PAGE_HOME_DISPLAY_NAME)
          ).toBeInTheDocument();
          expect(screen.getByText('Sophie Brown')).toBeInTheDocument();
        });
      });
    });
  });
});
