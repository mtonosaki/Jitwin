import React from 'react';
import { TestIds } from 'tests/TestIds';
import GuiView from 'mvfp/GuiView';
import { GuiFeatureCollection } from 'mvfp/GuiFeatureCollection';
import styles from './JitStage.module.scss';

type Props = {
  isReadonly: boolean;
  features: GuiFeatureCollection;
};

export default function JitStage({ isReadonly, features }: Props) {
  return (
    <div className={styles.container} data-testid={TestIds.JIT_STAGE}>
      <GuiView
        data-testid={TestIds.JIT_STAGE_GUI_VIEW}
        className={styles.canvas}
      />
      {isReadonly && (
        <div className={styles.readonlyBar}>
          <div>
            <img src="/icons/readonly.svg" alt="locked" />
            <span>readonly mode</span>
          </div>
        </div>
      )}
    </div>
  );
}
