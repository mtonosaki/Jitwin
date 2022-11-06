import React, { useEffect, useRef } from 'react';
import { TestIds } from './tests/TestIds';
import GuiFeature from './GuiFeature';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';

type Props = {
  className?: string;
  features?: GuiFeature[];
  'data-testid'?: string;
};

export default function GuiView({
  className,
  features,
  'data-testid': dataTestId = TestIds.MVFP_VIEW_CANVAS,
}: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refIsBeforeFinished = useRef<GuiFeature[]>([]);

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
    featuresBeforeRun();

    const hTimer = setInterval(onIntervalEvent, FEATURE_EXECUTION_SPAN_MSEC);

    return () => {
      clearInterval(hTimer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
