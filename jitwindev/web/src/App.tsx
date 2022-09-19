import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'reset-css';
import { Paths } from 'Paths';
import HomePage from './HomePage';
import { CustomHttpClient } from './CustomHttpClient';
import { BackendApiUsersRepository } from './UsersRepository';

export default function App() {
  const httpClient = new CustomHttpClient(process.env.REACT_APP_API_HOST!);
  const usersRepository = new BackendApiUsersRepository(httpClient);

  return (
    <Routes>
      <Route
        path={Paths.HOME}
        element={<HomePage usersRepository={usersRepository} />}
      />
    </Routes>
  );
}
