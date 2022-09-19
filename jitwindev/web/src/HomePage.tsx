import React, { useState } from 'react';
import styles from './HomePage.module.scss';
import PrimaryButton from './Components/PrimaryButton';
import { Config } from './Config';
import { UsersRepository } from './UsersRepository';

export type Props = {
  usersRepository: UsersRepository;
};

export default function HomePage({ usersRepository }: Props) {
  const [displayName, setDisplayName] = useState('');

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
      <PrimaryButton
        className={styles.whoAmIButton}
        onClick={async () => {
          const me = await usersRepository.getMe();
          setDisplayName(me.displayName ?? 'n/a');
        }}
      >
        Who am I
      </PrimaryButton>
      <div className={styles.myNameIs}>{displayName}</div>
    </div>
  );
}
