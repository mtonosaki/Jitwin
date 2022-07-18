import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });
  it('Show JitWin', () => {
    expect(screen.getByText('Jitwin')).toBeInTheDocument();
  });
});
