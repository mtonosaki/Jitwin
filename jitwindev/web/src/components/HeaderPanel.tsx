import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestIds } from 'tests/TestIds';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import styles from './HeaderPanel.module.scss';
import SessionRepository from '../repos/SessionRepository';
import MessageBar from './MessageBar';

type Props = {
  sessionRepository: SessionRepository;
};

export default function HeaderPanel({ sessionRepository }: Props) {
  const [authenticatedUser] = useAuthenticatedUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {isMenuOpen && (
        <input
          type="button"
          data-testid={TestIds.MODAL_BACKGROUND}
          className={styles.modalBackground}
          onClick={() => {
            setIsMenuOpen(false);
          }}
        />
      )}
      <div data-testid={TestIds.PANEL_HEADER} className={styles.container}>
        <div className={styles.contents}>
          <button
            type="button"
            className={styles.logo}
            onClick={(e) => {
              navigate('/', { replace: true });
            }}
          >
            <span>Jitwin</span>
            <img src="/img/logoHeader.png" alt="small logo" />
          </button>
          <MessageBar />
          {authenticatedUser && (
            <>
              <div
                data-testid={TestIds.PANEL_HEADER_ACCOUNT}
                className={styles.accountBlock}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                >
                  <div className={styles.accountText}>
                    <div>{authenticatedUser.displayName}</div>
                    <div>{authenticatedUser.userPrincipalName}</div>
                  </div>
                  <img
                    className={styles.accountProfileImage}
                    src="/api/users/me/photo"
                    alt="profile"
                  />
                </button>
              </div>
              {isMenuOpen && (
                <div
                  data-testid={TestIds.PANEL_HEADER_ACCOUNT_MENU}
                  className={styles.accountMenu}
                >
                  <button
                    type="button"
                    onClick={async () => {
                      await sessionRepository.logoutSession();
                      window.location.href = '/';
                    }}
                  >
                    <img src="/icons/logout.svg" alt="Logout" />
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
