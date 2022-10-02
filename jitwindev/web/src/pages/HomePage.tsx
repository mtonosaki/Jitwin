import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from 'Components/PrimaryButton';
import { Config } from 'app/Config';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import SessionRepository from 'repos/SessionRepository';
import styles from './HomePage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
};

export default function HomePage({ sessionRepository }: Props) {
  const [authenticatedUser] = useAuthenticatedUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticatedUser && sessionRepository.isInLoginProcess()) {
      sessionRepository.resetInLoginProcess();
      navigate(`/${authenticatedUser.userId}/Menu`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser]);

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_HOME}>
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
                if (authenticatedUser) {
                  navigate(`/${authenticatedUser.userId}/Menu`);
                } else {
                  sessionRepository.setInLoginProcess();
                  const url = Config.loginUrl();
                  window.location.href = url;
                }
              }}
            >
              <span>Start</span>
              <span>Jitwin</span>
            </PrimaryButton>
            {authenticatedUser && (
              <div className={styles.logoutMessage}>
                <span>if you are not Sophie Brown, </span>
                <button
                  type="button"
                  onClick={() => {
                    sessionRepository.logoutSession();
                    global.location.href = '/';
                  }}
                >
                  logout
                </button>
                <span> first.</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.vMargin} />
      </div>
    </div>
  );
}
