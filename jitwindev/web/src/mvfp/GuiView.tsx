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

class GuiFeatureHandler extends GuiFeature {
  setPartsCollection(parts: GuiPartsCollection) {
    this.parts = parts;
  }

  drawParts() {
    this.parts.forEach((part) => {
      part.draw();
    });
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
    (GuiFeature.prototype as any).setPartsCollection =
      GuiFeatureHandler.prototype.setPartsCollection;

    (GuiFeature.prototype as any).drawParts =
      GuiFeatureHandler.prototype.drawParts;

    if (parts) {
      flatFeatures(features).forEach((feature) => {
        (feature as GuiFeatureHandler).setPartsCollection(parts);
      });
    }
  };

  const featuresBeforeRun = () => {
    enabledFeatures(features)
      .filter((feature) => !refIsBeforeFinished.current.includes(feature))
      .forEach((feature) => {
        feature.beforeRun();
        refIsBeforeFinished.current.push(feature);
      });
  };

  const drawParts = () => {
    enabledFeatures(features).forEach((feature) => {
      (feature as GuiFeatureHandler).drawParts();
    });
  };

  const onIntervalEvent = () => {
    featuresBeforeRun();
    drawParts();
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

const enabledFeatures = (root?: GuiFeature[]) =>
  flatFeatures(root).filter((f) => f.enabled);
