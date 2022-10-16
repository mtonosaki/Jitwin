import React, { useEffect } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { TestIds } from 'tests/TestIds';
import HeaderPanel from './HeaderPanel';
import { createSessionRepository } from '../tests/testUtilities';

const mockSpyNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockSpyNavigate,
}));

const mockSessionRepository = createSessionRepository();

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
  return <HeaderPanel sessionRepository={mockSessionRepository} />;
}

describe('HeaderPanel', () => {
  it('Sophie sees Jitwin logo', () => {
    render(
      <RecoilRoot>
        <HeaderPanel sessionRepository={mockSessionRepository} />
      </RecoilRoot>
    );
    const headerPanel = screen.getByTestId(TestIds.PANEL_HEADER);
    const logoButton = within(headerPanel).getByRole('button', {
      name: /Jitwin/,
    });

    expect(logoButton).toBeInTheDocument();
  });

  it('When Sophie click Jitwin logo, navigate to Home page', () => {
    render(
      <RecoilRoot>
        <HeaderPanel sessionRepository={mockSessionRepository} />
      </RecoilRoot>
    );
    const logoButton = screen.getByRole('button', { name: /Jitwin/ });

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

  it('Sophie can click account info to open menu', () => {
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );

    const accountContents = screen.getByTestId(TestIds.PANEL_HEADER_ACCOUNT);
    expect(accountContents).toBeInTheDocument();
    const accountAreaButton = within(accountContents).getByRole('button');
    expect(accountAreaButton).toBeInTheDocument();

    expect(
      screen.queryByTestId(TestIds.MODAL_BACKGROUND)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(TestIds.PANEL_HEADER_ACCOUNT_MENU)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Logout/ })
    ).not.toBeInTheDocument();

    fireEvent.click(accountAreaButton);

    expect(
      screen.getByTestId(TestIds.PANEL_HEADER_ACCOUNT_MENU)
    ).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.MODAL_BACKGROUND)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
  });

  it('Account menu can close when Sophie clicks dark screen', () => {
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );
    const accountArea = within(
      screen.getByTestId(TestIds.PANEL_HEADER_ACCOUNT)
    ).getByRole('button');
    fireEvent.click(accountArea);
    const darkScreen = screen.getByTestId(TestIds.MODAL_BACKGROUND);

    fireEvent.click(darkScreen);

    expect(
      screen.queryByTestId(TestIds.PANEL_HEADER_ACCOUNT_MENU)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(TestIds.MODAL_BACKGROUND)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Logout' })
    ).not.toBeInTheDocument();
  });

  it('Account menu can close when Sophie clicks account area again', () => {
    // GIVEN
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );
    const accountArea = within(
      screen.getByTestId(TestIds.PANEL_HEADER_ACCOUNT)
    ).getByRole('button');
    fireEvent.click(accountArea);

    // WHEN re-click
    fireEvent.click(accountArea);

    // THEN
    expect(
      screen.queryByTestId(TestIds.PANEL_HEADER_ACCOUNT_MENU)
    ).not.toBeInTheDocument();
  });

  it('When Sophie clicks logout button, logout', async () => {
    // GIVEN
    const locationHrefSpy = jest.fn();
    // @ts-ignore
    delete window.location;
    window.location = {} as any;
    Object.defineProperty(window.location, 'href', {
      set: locationHrefSpy,
    });
    const spyLogoutSession = jest.fn();
    mockSessionRepository.logoutSession = spyLogoutSession;
    render(
      <RecoilRoot>
        <HeaderPanelAuthedWrapper />
      </RecoilRoot>
    );
    const accountArea = within(
      screen.getByTestId(TestIds.PANEL_HEADER_ACCOUNT)
    ).getByRole('button');
    fireEvent.click(accountArea);
    const logoutButton = screen.getByRole('button', { name: /Logout/ });

    // WHEN
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    // THEN]
    expect(spyLogoutSession).toHaveBeenCalled();
    expect(locationHrefSpy).toHaveBeenCalledWith('/');
  });
});
