import React from 'react';
import styles from './HomePage.module.scss';
import PrimaryButton from './Components/PrimaryButton';
import { Config } from './Config';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <PrimaryButton
        className={styles.loginButton}
        icon="login"
        onClick={() => {
          const url = Config.loginUrl();
          window.location.href = url;
        }}
      >
        <span>Login to</span>
        <span>Jitwin</span>
      </PrimaryButton>
    </div>
  );
}
