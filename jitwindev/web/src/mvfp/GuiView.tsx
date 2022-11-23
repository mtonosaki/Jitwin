import React, { useEffect, useRef } from 'react';
import { TestIds } from './tests/TestIds';
import { GuiFeature } from './GuiFeature';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import { GuiPartsCollection } from './GuiPartsCollection';

type Props = {
  className?: string;
  features?: GuiFeature[];
  parts?: GuiPartsCollection;
  'data-testid'?: string;
};

class GuiFeatureInitializer extends GuiFeature {
  setPartsCollection(parts: GuiPartsCollection) {
    this.parts = parts;
  }
}

export default function GuiView({
  className,
  features,
  parts,
  'data-testid': dataTestId = TestIds.MVFP_VIEW_CANVAS,
}: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refIsBeforeFinished = useRef<GuiFeature[]>([]);

  const prepareFeature = () => {
    if (parts) {
      (GuiFeature.prototype as any).setPartsCollection =
        GuiFeatureInitializer.prototype.setPartsCollection;
      flatFeatures(features).forEach((feature) => {
        (feature as GuiFeatureInitializer).setPartsCollection(parts);
      });
      (GuiFeature.prototype as any).setPartsCollection = undefined;
    }
  };

  const featuresBeforeRun = () => {
    flatFeatures(features)
      .filter((feature) => feature.enabled)
      .filter((feature) => !refIsBeforeFinished.current.includes(feature))
      .forEach((feature) => {
        feature.beforeRun();
        refIsBeforeFinished.current.push(feature);
      });
  };

  const onIntervalEvent = () => {
    featuresBeforeRun();
  };

  // Feature Mechanism
  useEffect(() => {
    prepareFeature();
    featuresBeforeRun();
    const hTimer = setInterval(onIntervalEvent, FEATURE_EXECUTION_SPAN_MSEC);
    return () => {
      clearInterval(hTimer);
    };
  }, []); // eslint-disable-line

  return (
    <canvas ref={refCanvas} className={className} data-testid={dataTestId} />
  );
}

const flatFeatures = (root?: GuiFeature[]) => {
  if (root) {
    return root;
  }
  return [];
};
