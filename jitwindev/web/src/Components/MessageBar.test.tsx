import React, { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import MessageBar from './MessageBar';
import { useMessageRecords } from '../hooks/useMessageRecords';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

type Props = {
  givenName: string | undefined;
};

function MessageBarWrapper({ givenName }: Props) {
  const [addMessage] = useMessageRecords();
  const [, setAuthenticatedUser] = useAuthenticatedUser();
  // let timerHandler: NodeJS.Timeout;

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
  it('Sophie sees welcome message', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-10-13 14:15:16'));
    render(
      <RecoilRoot>
        <MessageBarWrapper givenName="Sophie" />
      </RecoilRoot>
    );

    expect(screen.getByText('14:15')).toBeInTheDocument();
    expect(
      screen.getByText('Sophie, welcome to Jitwin version 1.00')
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
      screen.getByText('Sophie, welcome to Jitwin version 1.00')
    ).toBeInTheDocument();
    expect(screen.getByText(':16')).toBeInTheDocument();
    expect(screen.queryByText('New Message !!')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(
      screen.getByText('Sophie, welcome to Jitwin version 1.00')
    ).toBeInTheDocument();
    expect(screen.getByText(':16')).toBeInTheDocument();
    expect(screen.getByText('New Message !!')).toBeInTheDocument();
    expect(screen.getByText(':26')).toBeInTheDocument();
  });
});
