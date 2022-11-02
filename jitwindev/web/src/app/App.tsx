import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UsersRepository } from 'repos/UsersRepository';
import UsersRepositoryBackend from 'repos/UsersRepositoryBackend';
import HttpClientCustom from 'network/HttpClientCustom';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useAuthenticateStatus } from 'hooks/useAuthenticateStatus';
import HomePage from 'pages/HomePage';
import MainPage from 'pages/MainPage';
import SessionRepositoryNetwork from '../repos/SessionRepositoryNetwork';

export default function App() {
  const httpClient = new HttpClientCustom(process.env.REACT_APP_API_HOST!);
  const usersRepository: UsersRepository = new UsersRepositoryBackend(
    httpClient
  );
  const sessionRepository = new SessionRepositoryNetwork(
    sessionStorage,
    httpClient
  );
  const [, setAuthenticatedUser] = useAuthenticatedUser();
  const [, setAuthenticateStatus] = useAuthenticateStatus();

  useEffect(() => {
    setAuthenticateStatus('waiting');

    usersRepository
      .getMe()
      .then((me) => {
        setAuthenticatedUser(me);
        setAuthenticateStatus('confirmed');
      })
      .catch(() => {
        setAuthenticatedUser(undefined);
        setAuthenticateStatus('error');
      });

    return () => setAuthenticateStatus('beforeConfirm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage sessionRepository={sessionRepository} />}
      />
      <Route
        path="/:targetOid/stage"
        element={<MainPage sessionRepository={sessionRepository} />}
      />
    </Routes>
  );
}
