import React, { useEffect } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { getVersion } from 'app/AppVersion';
import { useMessageRecords } from 'hooks/useMessageRecords';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { TestIds } from 'tests/TestIds';
import MessageBar from './MessageBar';

jest.mock('app/AppVersion');

type Props = {
  givenName: string | undefined;
};

function MessageBarWrapper({ givenName }: Props) {
  const [addMessage] = useMessageRecords();
  const [, setAuthenticatedUser] = useAuthenticatedUser();

  useEffect(() => {
    setAuthenticatedUser({
      userId: '3232-test-message-bar-1212',
      displayName: 'ソフィー ブラウン/Sophie Brown',
      givenName,
      userPrincipalName: 'sophie@tomarika.com',
    });

    const timerHandler = setTimeout(() => {
      addMessage({
        dateTimeReal: new Date(Date.now()),
        message: 'New Message !!',
      });
    }, 10000);
    return () => clearTimeout(timerHandler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <MessageBar />;
}

describe('MessageBar', () => {
  beforeEach(() => {
    (getVersion as any).mockClear();
    (getVersion as any).mockImplementation(() => '999.99');
  });

  it('Sophie sees welcome message', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-13 14:15:16'));

    render(
      <RecoilRoot>
        <MessageBarWrapper givenName="Sophie" />
      </RecoilRoot>
    );

    expect(screen.getByText('14:15')).toBeInTheDocument();
    expect(
      screen.getByText('Sophie, welcome to Jitwin version 999.99')
    ).toBeInTheDocument();
  });

  it('Sophie sees new message', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-13 14:15:16'));
    render(
      <RecoilRoot>
        <MessageBarWrapper givenName="Sophie" />
      </RecoilRoot>
    );

    expect(
      screen.getByText('Sophie, welcome to Jitwin version 999.99')
    ).toBeInTheDocument();
    expect(screen.getByText(':16')).toBeInTheDocument();
    expect(screen.queryByText('New Message !!')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(
      screen.getByText('Sophie, welcome to Jitwin version 999.99')
    ).toBeInTheDocument();
    expect(screen.getByText(':16')).toBeInTheDocument();
    expect(screen.getByText('New Message !!')).toBeInTheDocument();
    expect(screen.getByText(':26')).toBeInTheDocument();
  });

  it('Sophie sees open button', () => {
    render(
      <RecoilRoot>
        <MessageBarWrapper givenName="Sophie" />
      </RecoilRoot>
    );

    expect(screen.getByRole('img', { name: 'Open/Close' })).toBeInTheDocument();
  });

  it('Sophie can open message bar with the open button', () => {
    render(
      <RecoilRoot>
        <MessageBarWrapper givenName="Sophie" />
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).toBeInTheDocument();
    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).not.toHaveClass('open');
    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).not.toHaveClass('close'); // expecting close is not contain at start timing to disable animation.

    fireEvent.click(screen.getByTestId(TestIds.MESSAGE_OPEN_CLOSE_HANDLE));

    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).toHaveClass('open');
    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).not.toHaveClass('close');

    fireEvent.click(screen.getByTestId(TestIds.MESSAGE_OPEN_CLOSE_HANDLE));

    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).not.toHaveClass('open');
    expect(screen.getByTestId(TestIds.MESSAGE_BAR)).toHaveClass('close');
  });
});
