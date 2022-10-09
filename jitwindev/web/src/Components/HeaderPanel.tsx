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
          <div className={styles.accountBlock}>
            <div className={styles.accountText}>
              <div>{authenticatedUser.displayName}</div>
              <div>{authenticatedUser.userPrincipalName}</div>
            </div>
            <img
              className={styles.accountProfileImage}
              src="/api/users/me/photo"
              alt="profile"
            />
          </div>
        )}
      </div>
    </div>
  );
}
