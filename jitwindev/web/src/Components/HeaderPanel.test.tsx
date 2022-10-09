import React, { useEffect } from 'react';
import { render, screen, within } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { RecoilRoot } from 'recoil';
import HeaderPanel from './HeaderPanel';

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
    expect(headerPanel).toBeInTheDocument();
    expect(within(headerPanel).getByText('Jitwin')).toBeInTheDocument();
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
});
