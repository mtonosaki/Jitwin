import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import styles from './HeaderPanel.module.scss';

export default function HeaderPanel() {
  const [authenticatedUser] = useAuthenticatedUser();
  const navigate = useNavigate();

  return (
    <div data-testid={TestIds.PANEL_HEADER} className={styles.container}>
      <div className={styles.contents}>
        <button
          type="button"
          className={styles.title}
          onClick={(e) => {
            navigate('/', { replace: true });
          }}
        >
          Jitwin
        </button>
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
