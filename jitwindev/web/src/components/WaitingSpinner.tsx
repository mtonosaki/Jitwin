import React from 'react';
import { useWaitingSpinner } from 'hooks/useWaitingSpinner';
import styles from './WaitingSpinner.module.scss';
import { TestIds } from '../tests/TestIds';

export default function WaitingSpinner() {
  const [, , isShowLoadingSpinner] = useWaitingSpinner();

  if (isShowLoadingSpinner) {
    return (
      <div
        data-testid={TestIds.WAITING_SPINNER}
        className={styles.container}
        role="none"
      >
        <img src="/img/spnner-box.gif" alt="loading spinner" />
        <p>Loading...</p>
      </div>
    );
  }
  return <div />;
}
