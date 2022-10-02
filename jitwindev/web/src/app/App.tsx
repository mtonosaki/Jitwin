import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UsersRepository } from 'repos/UsersRepository';
import UsersRepositoryBackend from 'repos/UsersRepositoryBackend';
import HttpClientCustom from 'network/HttpClientCustom';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import HomePage from 'pages/HomePage';
import MenuPage from 'pages/MenuPage';

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
      <Route path="/:targetOid/menu" element={<MenuPage />} />
    </Routes>
  );
}
