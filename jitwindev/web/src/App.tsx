import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UsersRepository } from 'UsersRepository';
import UsersRepositoryBackend from 'UsersRepositoryBackend';
import HttpClientCustom from 'HttpClientCustom';
import { useAuthenticatedUser } from 'useAuthenticatedUser';
import HomePage from 'Pages/HomePage';

export default function App() {
  const httpClient = new HttpClientCustom(process.env.REACT_APP_API_HOST!);
  const usersRepository: UsersRepository = new UsersRepositoryBackend(
    httpClient
  );
  const [, setAuthenticatedUser] = useAuthenticatedUser();

  useEffect(() => {
    usersRepository.getMe().then((me) => {
      setAuthenticatedUser(me);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
