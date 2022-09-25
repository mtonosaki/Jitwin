import React, { useEffect, useState } from 'react';
import PrimaryButton from 'Components/PrimaryButton';
import SessionRepository from 'SessionRepository';
import { Config } from 'Config';
import { TestIds } from '../tests/TestIds';
import styles from './HomePage.module.scss';

export type Props = {
  sessionRepository: SessionRepository;
};

export default function HomePage({ sessionRepository }: Props) {
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const me = sessionRepository.getAuthenticatedUser();
    if (me) {
      setDisplayName(me.displayName ?? '(no name)');
    }
  }, [sessionRepository]);

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <div className={styles.vMargin} />
        {displayName && (
          <div data-testid={TestIds.PAGE_HOME_DISPLAY_NAME}>{displayName}</div>
        )}
        <div>
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
        <div className={styles.vMargin} />
      </div>
    </div>
  );
}
