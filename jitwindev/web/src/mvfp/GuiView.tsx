import React, { useEffect, useRef } from 'react';
import { MvfpTestIds } from './tests/MvfpTestIds';
import { GuiFeature } from './GuiFeature';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import { GuiPartsLayerCollection } from './GuiPartsCollection';
import { GuiFeatureCollection } from './GuiFeatureCollection';

type Props = {
  className?: string;
  features?: GuiFeatureCollection;
  partsLayers?: GuiPartsLayerCollection;
  'data-testid'?: string;
};

export default function GuiView({
  className,
  features = [],
  partsLayers = new Map(),
  'data-testid': dataTestId = MvfpTestIds.VIEW_CANVAS,
}: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refIsBeforeFinished = useRef<GuiFeatureCollection>([]);
  const refDrawnParts = useRef<any[]>([]);

  // for Testing
  Object.defineProperty(global, 'mvfpViewParameter', {
    value: {
      isBeforeFinished: refIsBeforeFinished.current,
      features,
      partsLayers,
      refDrawnParts,
    },
    writable: true,
    configurable: true,
  });

  // Feature Mechanism
  useEffect(() => {
    prepareFeature();
    executeFeaturesBeforeRun();
    const hTimer = setInterval(intervalEvent, FEATURE_EXECUTION_SPAN_MSEC);
    return () => {
      clearInterval(hTimer);
    };
  }, [features]); // eslint-disable-line

  const prepareFeature = () => {
    FeatureHandler.initialize();

    flatFeatures(features).forEach((feature) => {
      feature.setPartsLayerCollection(partsLayers!);
    });
  };

  const executeFeaturesBeforeRun = () => {
    enabledFeatures(features)
      .filter((feature) => !refIsBeforeFinished.current.includes(feature))
      .forEach((feature) => {
        feature.beforeRun();
        refIsBeforeFinished.current.push(feature);
      });
  };

  const intervalEvent = () => {
    // follow disabled->enabled timing beforeRun()
    executeFeaturesBeforeRun();

    // Draw Parts
    refDrawnParts.current.splice(0);
    const context = refCanvas.current?.getContext('2d');
    if (!context) return;

    context.canvas.width = context.canvas.clientWidth;
    context.canvas.height = context.canvas.clientHeight;
    context.clearRect(
      0,
      0,
      context.canvas.clientWidth,
      context.canvas.clientHeight
    );

    partsLayers.forEach((layer) => {
      layer.forEach((part) => {
        const converters = layer.getConverters();
        part.draw({
          g: context,
          converters,
        });
        refDrawnParts.current.push(part);
      });
    });
  };

  return (
    <canvas ref={refCanvas} className={className} data-testid={dataTestId} />
  );
}

const flatFeatures = (root?: GuiFeatureCollection) =>
  root!.map((it) => it as FeatureHandler);

const enabledFeatures = (root?: GuiFeatureCollection) =>
  flatFeatures(root).filter((it) => it.enabled);

// Partial class of GuiFeature for internal GuiView.
class FeatureHandler extends GuiFeature {
  static initialize() {
    (GuiFeature.prototype as any).setPartsLayerCollection =
      FeatureHandler.prototype.setPartsLayerCollection;
  }

  setPartsLayerCollection(partsLayers: GuiPartsLayerCollection) {
    this.partsLayers = partsLayers;
  }
}
