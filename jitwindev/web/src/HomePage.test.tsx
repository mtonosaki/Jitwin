import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HomePage from './HomePage';

const usersRepositoryStub = { getMe: jest.fn() };

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
        render(<HomePage usersRepository={usersRepositoryStub} />);

        const loginButton = getLoginButton();
        fireEvent.click(loginButton);

        expect(locationHrefSpy).toHaveBeenCalledWith(
          'http://localhost:8080/oauth2/authorization/graph'
        );
      });

      it('Given production mode, when click login button, link url starts with /', () => {
        process.env.REACT_APP_NODE_ENV = 'production';
        render(<HomePage usersRepository={usersRepositoryStub} />);

        const loginButton = getLoginButton();
        fireEvent.click(loginButton);

        expect(locationHrefSpy).toHaveBeenCalledWith(
          '/oauth2/authorization/graph'
        );
      });
    });

    describe('Behavior', () => {
      it('Show login button', () => {
        render(<HomePage usersRepository={usersRepositoryStub} />);

        expect(
          screen.getByRole('img', { name: 'login-icon' })
        ).toBeInTheDocument();
        const loginButton = getLoginButton();
        expect(loginButton).toBeInTheDocument();
      });
    });

    describe('Who am I', () => {
      it('Show Who am I button', () => {
        render(<HomePage usersRepository={usersRepositoryStub} />);

        const button = screen.getByRole('button', { name: /Who am I/ });
        expect(button).toBeInTheDocument();
      });

      it('Given showing home, when click Who am I button, then show display name', async () => {
        // GIVEN
        usersRepositoryStub.getMe.mockResolvedValue({
          displayName: 'Sophie Brown',
          oid: '123-345-567',
        });
        render(<HomePage usersRepository={usersRepositoryStub} />);

        // WHEN
        const button = screen.getByRole('button', { name: /Who am I/ });
        await act(async () => {
          fireEvent.click(button);
        });

        // THEN
        expect(usersRepositoryStub.getMe).toBeCalledTimes(1);
        expect(screen.getByText('Sophie Brown')).toBeInTheDocument();
      });
    });
  });
});
