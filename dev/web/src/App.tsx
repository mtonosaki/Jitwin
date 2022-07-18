import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'reset-css';
import { Paths } from 'Paths';
import HomePage from './HomePage';

export default function App() {
  return (
    <Routes>
      <Route path={Paths.HOME} element={<HomePage />} />
    </Routes>
  );
}
