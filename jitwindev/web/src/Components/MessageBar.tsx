import React, { useEffect } from 'react';
import { TestIds } from 'tests/TestIds';
import { newMessage, useMessageRecords } from 'hooks/useMessageRecords';
import { getVersion } from 'app/AppVersion';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import DateTimeTwin from './DateTimeTwin';
import styles from './MessageBar.module.scss';

export default function MessageBar() {
  const [addMessage, messageRecords] = useMessageRecords();
  const [user] = useAuthenticatedUser();

  useEffect(() => {
    if (user) {
      if (user.givenName) {
        addMessage(
          newMessage(
            `${user.givenName}, welcome to Jitwin version ${getVersion()}`
          )
        );
      } else {
        addMessage(newMessage(`Welcome to Jitwin version ${getVersion()}`));
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
          <DateTimeTwin vr="Real" value={record.dateTimeReal.getTime()} />
          <span>{record.message}</span>
        </li>
      ))}
    </ul>
  );
}
