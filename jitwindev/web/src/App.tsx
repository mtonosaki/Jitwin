import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'reset-css';
import HomePage from 'Pages/HomePage';
import SessionRepository from 'SessionRepository';
import { UsersRepository } from 'UsersRepository';
import UsersRepositoryBackend from 'UsersRepositoryBackend';
import HttpClientCustom from 'HttpClientCustom';

export default function App() {
  const httpClient = new HttpClientCustom(process.env.REACT_APP_API_HOST!);
  const usersRepository: UsersRepository = new UsersRepositoryBackend(
    httpClient
  );
  const sessionRepository = new SessionRepository();

  useEffect(() => {
    usersRepository.getMe().then((me) => {
      sessionRepository.setAuthenticatedUser(me);
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage sessionRepository={sessionRepository} />}
      />
    </Routes>
  );
}
