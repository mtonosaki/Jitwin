import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from 'components/PrimaryButton';
import { Config } from 'app/Config';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import SessionRepository from 'repos/SessionRepository';
import WaitingSpinner from 'components/WaitingSpinner';
import { useWaitingSpinner } from 'hooks/useWaitingSpinner';
import { useAuthenticateStatus } from 'hooks/useAuthenticateStatus';
import styles from './HomePage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
};

export default function HomePage({ sessionRepository }: Props) {
  const [authenticatedUser] = useAuthenticatedUser();
  const [authenticateStatus] = useAuthenticateStatus();
  const [requestToShowWaitingSpinner, requestToHideWaitingSpinner] =
    useWaitingSpinner();
  const navigate = useNavigate();

  useEffect(() => {
    requestToShowWaitingSpinner();
    return () => requestToHideWaitingSpinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticateStatus === 'confirmed' || authenticateStatus === 'error') {
      requestToHideWaitingSpinner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticateStatus]);

  useEffect(() => {
    if (authenticatedUser && sessionRepository.isInLoginProcess()) {
      sessionRepository.resetInLoginProcess();
      navigate(`/${authenticatedUser.userId}/Menu`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser]);

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_HOME}>
      <WaitingSpinner />
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
                  navigate(`/${authenticatedUser.userId}/stage`, {
                    replace: true,
                  });
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
                  onClick={async () => {
                    await sessionRepository.logoutSession();
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
