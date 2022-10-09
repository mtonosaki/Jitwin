import React from 'react';
import { TestIds } from 'tests/TestIds';
import styles from './HeaderPanel.module.scss';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

export default function HeaderPanel() {
  const [authenticatedUser] = useAuthenticatedUser();

  return (
    <div data-testid={TestIds.PANEL_HEADER} className={styles.container}>
      <div className={styles.contents}>
        <h1 className={styles.title}>Jitwin</h1>
        {authenticatedUser && (
          <div className={styles.account}>
            <div>{authenticatedUser.displayName}</div>
            <div>{authenticatedUser.userPrincipalName}</div>
          </div>
        )}
      </div>
    </div>
  );
}
