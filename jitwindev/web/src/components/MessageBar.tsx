import React, { useEffect, useState } from 'react';
import { TestIds } from 'tests/TestIds';
import { newMessage, useMessageRecords } from 'hooks/useMessageRecords';
import { getVersion } from 'app/AppVersion';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import classNames from 'classnames';
import styles from './MessageBar.module.scss';
import DateTimeTwin from './DateTimeTwin';

function makeOpacityValue(isBarOpen: boolean, key: number): number {
  if (isBarOpen) {
    return 1.0;
  }
  if (key === 0) return 1.0;
  return 0.5;
}

export default function MessageBar() {
  const [addMessage, messageRecords] = useMessageRecords();
  const [user] = useAuthenticatedUser();
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [closeStyle, setCloseStyle] = useState('');

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
    <>
      <div
        data-testid={TestIds.MESSAGE_BAR}
        className={classNames(
          styles.container,
          styles.scrollBar,
          isBarOpen ? styles.open : closeStyle
        )}
      >
        <table>
          <tbody>
            {messageRecords.map((record, key) => (
              <tr
                key={`message-record-${key + 1}-${
                  record.message
                }-${record.dateTimeReal.getTime()}`}
                style={{ opacity: makeOpacityValue(isBarOpen, key) }}
              >
                <td>
                  <DateTimeTwin
                    vr="Real"
                    value={record.dateTimeReal.getTime()}
                  />
                </td>
                <td>
                  <span>{record.message}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        key={`${isBarOpen ? 'openedBar' : 'closedBar'}`}
        type="button"
        className={classNames(
          styles.openCloseHandle,
          isBarOpen ? styles.spinOpen : styles.spinClose
        )}
        data-testid={TestIds.MESSAGE_OPEN_CLOSE_HANDLE}
        onClick={() => {
          setCloseStyle(styles.close);
          setIsBarOpen(!isBarOpen);
        }}
      >
        <img
          src={
            isBarOpen
              ? '/icons/messageBarClose.svg'
              : '/icons/messageBarOpen.svg'
          }
          alt="Open/Close"
        />
      </button>
    </>
  );
}
