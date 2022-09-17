import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

describe('HomePage', () => {
  describe('Login', () => {
    const getLoginButton = () =>
      screen.getByRole('button', { name: /Login to Jitwin/ });

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
        render(<HomePage />);
        const loginButton = getLoginButton();
        userEvent.click(loginButton);
        expect(locationHrefSpy).toHaveBeenCalledWith(
          'http://localhost:8080/oauth2/authorization/graph'
        );
      });

      it('Given production mode, when click login button, link url starts with /', () => {
        process.env.REACT_APP_NODE_ENV = 'production';
        render(<HomePage />);
        const loginButton = getLoginButton();
        userEvent.click(loginButton);
        expect(locationHrefSpy).toHaveBeenCalledWith(
          '/oauth2/authorization/graph'
        );
      });
    });

    describe('Behavior', () => {
      it('Show login button', () => {
        render(<HomePage />);
        expect(
          screen.getByRole('img', { name: 'login-icon' })
        ).toBeInTheDocument();
        const loginButton = getLoginButton();
        expect(loginButton).toBeInTheDocument();
      });
    });
  });
});
