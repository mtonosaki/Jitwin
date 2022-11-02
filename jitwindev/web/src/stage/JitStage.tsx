import React from 'react';
import { TestIds } from 'tests/TestIds';
import styles from './JitStage.module.scss';
import GuiView from '../mvfp/GuiView';

type Props = {
  isReadonly: boolean;
};

export default function JitStage({ isReadonly }: Props) {
  return (
    <div className={styles.container} data-testid={TestIds.JIT_STAGE}>
      <GuiView className={styles.canvas} />
      {isReadonly && (
        <div className={styles.readonlyBar}>
          <img src="/icons/readonly.svg" alt="locked" />
          <span>readonly mode</span>
        </div>
      )}
    </div>
  );
}
