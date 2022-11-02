import React from 'react';
import { TestIds } from 'tests/TestIds';
import styles from './JitStage.module.scss';

export default function JitStage() {
  return (
    <div className={styles.container} data-testid={TestIds.JIT_STAGE}>
      <canvas />
    </div>
  );
}
