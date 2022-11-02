import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { RecoilRoot } from 'recoil';
import { makeMockSessionRepository } from 'tests/testUtilities';
import MainPage from './MainPage';

const mockSpyNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
}));

describe('MainPage', () => {
  it('Sophie sees Header', () => {
    render(
      <RecoilRoot>
        <MainPage sessionRepository={makeMockSessionRepository()} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PANEL_HEADER)).toBeInTheDocument();
  });

  it('Sophie feels JitStage is shown', () => {
    render(
      <RecoilRoot>
        <MainPage sessionRepository={makeMockSessionRepository()} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.JIT_STAGE)).toBeInTheDocument();
  });
});
