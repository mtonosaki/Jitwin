import React, { useEffect, useState } from 'react';
import { TestIds } from 'tests/TestIds';
import GuiView from 'mvfp/GuiView';
import { GuiFeatureCollection } from 'mvfp/GuiFeatureCollection';
import styles from './JitStage.module.scss';
import { FeatureJitProcess } from './features/FeatureJitProcess';
import { GuiPartsLayerCollection } from '../mvfp/GuiPartsCollection';

type Props = {
  isReadonly: boolean;
  features: GuiFeatureCollection;
};

export default function JitStage({ isReadonly, features }: Props) {
  const [stageFeatures, setStageFeatures] = useState<GuiFeatureCollection>([]);
  const [partsLayers] = useState<GuiPartsLayerCollection>(new Map());

  useEffect(() => {
    const featureProcess = new FeatureJitProcess();
    setStageFeatures([...features, featureProcess]);
  }, [features]);

  return (
    <div className={styles.container} data-testid={TestIds.JIT_STAGE}>
      <GuiView
        data-testid={TestIds.JIT_STAGE_GUI_VIEW}
        className={styles.canvas}
        features={stageFeatures}
        partsLayers={partsLayers}
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
