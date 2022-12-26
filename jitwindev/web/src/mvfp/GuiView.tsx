import { GuiPart } from 'mvfp/GuiPart';
import React, { useEffect, useRef, useState } from 'react';
import { MvfpTestIds } from './tests/MvfpTestIds';
import { GuiFeature } from './GuiFeature';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from './GuiPartsCollection';
import { GuiFeatureCollection } from './GuiFeatureCollection';
import { PaneState, screenPosition0 } from './ThreeCoordinatesSystem';
import { DrawProps, Positioner } from './GuiTypes';
import { GuiPane, Pane } from './GuiPane';

type Props = {
  className?: string;
  features?: GuiFeatureCollection;
  partsLayers?: GuiPartsLayerCollection;
  'data-testid'?: string;
};

export type DrawnPart = {
  part: GuiPart;
  positioner: Positioner;
  layer: GuiPartsCollection;
};

export default function GuiView({
  className,
  features = [],
  partsLayers = new Map(),
  'data-testid': dataTestId = MvfpTestIds.VIEW_CANVAS,
}: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refIsBeforeFinished = useRef<GuiFeatureCollection>([]);
  const refDrawnParts = useRef<DrawnPart[]>([]);
  const [paneState] = useState<PaneState>({ scroll: screenPosition0 });
  const refDefaultPane = useRef(null);

  useEffect(() => {
    // for Testing library
    Object.defineProperty(global, 'mvfpViewParameter', {
      value: {
        isBeforeFinished: refIsBeforeFinished.current,
        features,
        partsLayers,
        refDrawnParts,
        refDefaultPane,
      },
      writable: true,
      configurable: true,
    });
  }, []); // eslint-disable-line

  // Initialize Feature Mechanism
  useEffect(() => {
    FeatureHandler.initialize();

    flatFeatures(features).forEach((feature) => {
      feature.setPartsLayerCollection(partsLayers!);
      feature.setTargetPane(refDefaultPane.current);
    });

    executeFeaturesBeforeRun();
    const hTimer = setInterval(intervalEvent, FEATURE_EXECUTION_SPAN_MSEC);
    return () => {
      clearInterval(hTimer);
    };
  }, [features]); // eslint-disable-line

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
      const converters = layer.getConverters();
      const dp: DrawProps = {
        g: context,
        converters,
        pane: paneState,
      };
      layer.forEach((part) => {
        part.draw(dp);

        // save drawn result for testing library
        const drawn: DrawnPart = {
          part,
          positioner: { converters, pane: paneState },
          layer,
        };
        refDrawnParts.current.push(drawn);
      });
    });
  };

  return (
    <>
      <canvas ref={refCanvas} className={className} data-testid={dataTestId} />
      <GuiPane
        ref={refDefaultPane}
        name="DEFAULT"
        data-testid={MvfpTestIds.DEFAULT_PANE}
      />
    </>
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

    (GuiFeature.prototype as any).setTargetPane =
      FeatureHandler.prototype.setTargetPane;
  }

  setPartsLayerCollection(partsLayers: GuiPartsLayerCollection) {
    this.partsLayers = partsLayers;
  }

  setTargetPane(pane: Pane | null) {
    if (pane) {
      this.targetPane = pane;
    } else {
      this.targetPane = undefined;
    }
  }
}
