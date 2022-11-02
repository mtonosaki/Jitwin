import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { RecoilRoot } from 'recoil';
import MainPage from './MainPage';
import { createSessionRepository } from '../tests/testUtilities';

const mockSpyNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
}));
const mockSessionRepository = createSessionRepository();

describe('MainPage', () => {
  it('Sophie sees Header', () => {
    render(
      <RecoilRoot>
        <MainPage sessionRepository={mockSessionRepository} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PANEL_HEADER)).toBeInTheDocument();
  });

  it( 'Sophie feels JitStage is shown', () => {
    render(
      <RecoilRoot>
        <MainPage sessionRepository={mockSessionRepository} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.JIT_STAGE)).toBeInTheDocument();
  });
});
