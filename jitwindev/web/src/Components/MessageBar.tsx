import React, { useEffect } from 'react';
import { TestIds } from 'tests/TestIds';
import { newMessage, useMessageRecords } from 'hooks/useMessageRecords';
import DateTime from './DateTime';
import styles from './MessageBar.module.scss';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

export default function MessageBar() {
  const [addMessage, messageRecords] = useMessageRecords();
  const [user] = useAuthenticatedUser();

  useEffect(() => {
    if (user) {
      if (user.givenName) {
        addMessage(
          newMessage(`${user.givenName}, welcome to Jitwin version 1.00`)
        );
      } else {
        addMessage(newMessage('Welcome to Jitwin version 1.00'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ul data-testid={TestIds.MESSAGE_BAR} className={styles.container}>
      {messageRecords.map((record, key) => (
        <li
          key={`message-record-${key + 1}-${
            record.message
          }-${record.dateTimeReal.getTime()}`}
          data-testid={`test-id-message-record-${key + 1}`}
        >
          <DateTime vr="Real" value={record.dateTimeReal.getTime()} />
          <span>{record.message}</span>
        </li>
      ))}
    </ul>
  );
}
