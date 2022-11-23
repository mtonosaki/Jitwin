import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { RecoilRoot } from 'recoil';
import { makeMockSessionRepository } from 'tests/testUtilities';
import { useParams } from 'react-router-dom';
import { mocked } from 'jest-mock';
import MainPage from './MainPage';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

HTMLCanvasElement.prototype.getContext = jest.fn();
const mockSpyNavigate = jest.fn();
const mockStubUseParams = mocked(useParams);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
  useParams: jest.fn(),
}));

describe('Sophie`s Main Page', () => {
  it('Sophie sees Header', () => {
    mockStubUseParams.mockReturnValue({ targetOid: 'userid-sophie-9988' });
    render(
      <RecoilRoot>
        <MainPage sessionRepository={makeMockSessionRepository()} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PANEL_HEADER)).toBeInTheDocument();
  });

  it('Sophie feels JitStage is shown', () => {
    mockStubUseParams.mockReturnValue({ targetOid: 'userid-sophie-9988' });
    render(
      <RecoilRoot>
        <MainPage sessionRepository={makeMockSessionRepository()} />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.JIT_STAGE)).toBeInTheDocument();
  });

  describe('When Michael opens', () => {
    it('Sophie`s page, he sees readonly mark', () => {
      // GIVEN
      mockStubUseParams.mockReturnValue({ targetOid: 'userid-sophie-9988' });

      // WHEN
      function CustomDraw() {
        const [, setAuthenticatedUser] = useAuthenticatedUser();
        useEffect(() => {
          setAuthenticatedUser({
            userId: 'userid-michael-1234',
            displayName: 'Michael Turner',
            givenName: 'Michael',
            userPrincipalName: 'mturner@example.com',
          });
        }, []); // eslint-disable-line react-hooks/exhaustive-deps
        return <MainPage sessionRepository={makeMockSessionRepository()} />;
      }
      render(
        <RecoilRoot>
          <CustomDraw />
        </RecoilRoot>
      );

      // THEN
      expect(screen.getByText(/readonly mode/)).toBeInTheDocument();
    });

    it('his page, he does not sees readonly mark', () => {
      // GIVEN
      mockStubUseParams.mockReturnValue({ targetOid: 'userid-michael-1234' });

      // WHEN
      function CustomDraw() {
        const [, setAuthenticatedUser] = useAuthenticatedUser();
        useEffect(() => {
          setAuthenticatedUser({
            userId: 'userid-michael-1234',
            displayName: 'Michael Turner',
            givenName: 'Michael',
            userPrincipalName: 'mturner@example.com',
          });
        }, []); // eslint-disable-line react-hooks/exhaustive-deps
        return <MainPage sessionRepository={makeMockSessionRepository()} />;
      }
      render(
        <RecoilRoot>
          <CustomDraw />
        </RecoilRoot>
      );

      // THEN
      expect(screen.queryByText(/readonly mode/)).not.toBeInTheDocument();
    });
  });
});
