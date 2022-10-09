import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { RecoilRoot } from 'recoil';
import MainPage from './MainPage';

describe('MainPage', () => {
  it('Sophie sees Main title', () => {
    render(
      <RecoilRoot>
        <MainPage />
      </RecoilRoot>
    );
    expect(screen.getByRole('heading', { name: 'Main' })).toBeInTheDocument();
  });
  it('Sophie sees Header', () => {
    render(
      <RecoilRoot>
        <MainPage />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PANEL_HEADER)).toBeInTheDocument();
  });
});
