import { render, screen } from '@testing-library/react';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { mocked } from 'jest-mock';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { TestIds } from 'tests/TestIds';
import { makeMockSessionRepository } from 'tests/testUtilities';
import MainPage from './MainPage';

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
        <MainPage
          sessionRepository={makeMockSessionRepository()}
          features={[]}
        />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PANEL_HEADER)).toBeInTheDocument();
  });

  it('Sophie feels JitStage is shown', () => {
    mockStubUseParams.mockReturnValue({ targetOid: 'userid-sophie-9988' });
    render(
      <RecoilRoot>
        <MainPage
          sessionRepository={makeMockSessionRepository()}
          features={[]}
        />
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
        return (
          <MainPage
            sessionRepository={makeMockSessionRepository()}
            features={[]}
          />
        );
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
        return (
          <MainPage
            sessionRepository={makeMockSessionRepository()}
            features={[]}
          />
        );
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
