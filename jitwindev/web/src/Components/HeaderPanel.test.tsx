import React, { useEffect } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { TestIds } from 'tests/TestIds';
import HeaderPanel from './HeaderPanel';

const mockSpyNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
}));

function HeaderPanelAuthedWrapper() {
  const [, setAuthenticatedUser] = useAuthenticatedUser();
  useEffect(() => {
    setAuthenticatedUser({
      userId: '1111-test-header-panel-2222',
      displayName: 'ソフィー ブラウン/Sophie Brown',
      userPrincipalName: 'sophie@tomarika.com',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HeaderPanel />;
}

describe('HeaderPanel', () => {
  it('Sophie sees Jitwin logo', () => {
    render(
      <RecoilRoot>
        <HeaderPanel />
      </RecoilRoot>
    );
    const headerPanel = screen.getByTestId(TestIds.PANEL_HEADER);
    const logoButton = within(headerPanel).getByRole('button', {
      name: 'Jitwin',
    });

    expect(logoButton).toBeInTheDocument();
  });

  it('When Sophie click Jitwin logo, navigate to Home page', () => {
    render(
      <RecoilRoot>
        <HeaderPanel />
      </RecoilRoot>
    );
    const logoButton = screen.getByRole('button', { name: 'Jitwin' });

    fireEvent.click(logoButton);

    expect(mockSpyNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('Sophie sees her account', () => {
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );

    const headerPanel = screen.getByTestId(TestIds.PANEL_HEADER);
    expect(headerPanel).toBeInTheDocument();
    expect(
      within(headerPanel).getByText('ソフィー ブラウン/Sophie Brown')
    ).toBeInTheDocument();
    expect(
      within(headerPanel).getByText('sophie@tomarika.com')
    ).toBeInTheDocument();
  });

  it('Sophie sees her profile image', () => {
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );
    const headerPanel = screen.getByTestId(TestIds.PANEL_HEADER);
    expect(
      within(headerPanel).getByRole('img', { name: 'profile' })
    ).toBeInTheDocument();
  });

  it('Sophie sees message bar', () => {
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );

    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).toBeInTheDocument();
  });
});
