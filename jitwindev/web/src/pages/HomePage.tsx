import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from 'components/PrimaryButton';
import { Config } from 'app/Config';
import SessionRepository from 'repos/SessionRepository';
import WaitingSpinner from 'components/WaitingSpinner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useWaitingSpinner } from 'hooks/useWaitingSpinner';
import { useAuthenticateStatus } from 'hooks/useAuthenticateStatus';
import { TestIds } from 'tests/TestIds';
import styles from './HomePage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
};

export default function HomePage({ sessionRepository }: Props) {
  const [authenticatedUser] = useAuthenticatedUser();
  const [authenticateStatus] = useAuthenticateStatus();
  const [stateWaveStyle, setStateWaveStyle] = useState('');
  const [requestToShowWaitingSpinner, requestToHideWaitingSpinner] =
    useWaitingSpinner();
  const navigate = useNavigate();

  useEffect(() => {
    requestToShowWaitingSpinner();
    return () => requestToHideWaitingSpinner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let z = 0;
    let x = 100;
    const handler = setInterval(() => {
      z += 0.1;
      x = (x + 99.5) % 100;
      setStateWaveStyle(
        `url(/img/wave.svg) left ${x}% top 50%  / auto ${
          Math.cos(z) * 2 + 120
        }px repeat-x #ece5d9`
      );
    }, 1000 / 29.7);
    return () => clearInterval(handler);
  }, []);

  useEffect(() => {
    if (authenticateStatus === 'confirmed' || authenticateStatus === 'error') {
      requestToHideWaitingSpinner();
    }
  }, [authenticateStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authenticatedUser && sessionRepository.isInLoginProcess()) {
      sessionRepository.resetInLoginProcess();
      navigate(`/${authenticatedUser.userId}/stage`, { replace: true });
    }
  }, [authenticatedUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_HOME}>
      <WaitingSpinner />
      <div className={styles.container} style={{ background: stateWaveStyle }}>
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
