import React from 'react';
import { render, screen } from '@testing-library/react';
import MainPage from './MainPage';

describe('MainPage', () => {
  it('Sophie sees Main title', () => {
    render(<MainPage />);
    expect(screen.getByRole('heading', { name: 'Main' })).toBeInTheDocument();
  });
});
