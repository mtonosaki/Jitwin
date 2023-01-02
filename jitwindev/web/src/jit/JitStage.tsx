import { GuiFeatureCollection } from 'mvfp/GuiFeatureCollection';
import { GuiPartsLayerCollection } from 'mvfp/GuiPartsCollection';
import GuiView from 'mvfp/GuiView';
import { CallbackAddLog } from 'mvfp/utils/LogSystem';
import React, { useEffect, useState } from 'react';
import { TestIds } from 'tests/TestIds';
import { FeatureJitProcess } from './features/FeatureJitProcess';
import styles from './JitStage.module.scss';

type Props = {
  isReadonly: boolean;
  features: GuiFeatureCollection;
  onAddLog?: CallbackAddLog;
};

export default function JitStage({ isReadonly, features, onAddLog }: Props) {
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
        features={stageFeatures}
        partsLayers={partsLayers}
        onAddLog={onAddLog}
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
