import React from 'react';
import styles from './HomePage.module.scss';
import PrimaryButton from './Components/PrimaryButton';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jitwin</h1>
      <PrimaryButton icon="login">Login</PrimaryButton>
    </div>
  );
}
