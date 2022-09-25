import React from 'react';
import PrimaryButton from 'Components/PrimaryButton';
import { Config } from 'Config';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'useAuthenticatedUser';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const [authenticatedUser] = useAuthenticatedUser();

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <div className={styles.vMargin} />
        <div>
          <div className={styles.mainContent}>
            <div className={styles.welcomeName}>
              {authenticatedUser && (
                <>
                  <span>Hi, </span>
                  <span data-testid={TestIds.PAGE_HOME_DISPLAY_NAME}>
                    {authenticatedUser.displayName}
                  </span>
                  <span> 😊</span>
                </>
              )}
            </div>
            <PrimaryButton
              className={styles.loginButton}
              icon="login"
              onClick={() => {
                const url = Config.loginUrl();
                window.location.href = url;
              }}
            >
              <span>Start</span>
              <span>Jitwin</span>
            </PrimaryButton>
          </div>
        </div>
        <div className={styles.vMargin} />
      </div>
    </div>
  );
}
