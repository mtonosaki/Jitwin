import { GuiPart } from 'mvfp/GuiPart'
import { callbackAddLog } from 'mvfp/utils/LogSystem'
import React, { useEffect, useRef } from 'react'
import { GuiFeature } from './GuiFeature'
import { GuiFeatureCollection } from './GuiFeatureCollection'
import { GuiPane, Pane } from './GuiPane'
import { GuiPartsCollection, GuiPartsLayerCollection, } from './GuiPartsCollection'
import { DrawProps, Positioner } from './GuiTypes'
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters'
import { MvfpTestIds } from './tests/MvfpTestIds'

type Props = {
  features?: GuiFeatureCollection;
  partsLayers?: GuiPartsLayerCollection;
  'data-testid'?: string;
  onAddLog?: callbackAddLog;
};

export type DrawnPart = {
  part: GuiPart;
  positioner: Positioner;
  layer: GuiPartsCollection;
};

export default function GuiView({
  features = [],
  partsLayers = new Map(),
  'data-testid': dataTestId = MvfpTestIds.VIEW_CANVAS,
  onAddLog,
}: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refIsBeforeFinished = useRef<GuiFeatureCollection>([]);
  const refDrawnParts = useRef<DrawnPart[]>([]);
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
      if (refDefaultPane.current) {
        feature.setTargetPane(refDefaultPane.current);
      }
      if (onAddLog) {
        feature.setAddLog(onAddLog);
      }
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
      layer.forEach((panePart) => {
        const dp: DrawProps = {
          g: context,
          converters,
          pane: panePart.pane,
        };
        panePart.part.draw(dp);

        // save drawn result for testing library
        const drawn: DrawnPart = {
          part: panePart.part,
          positioner: dp,
          layer,
        };
        refDrawnParts.current.push(drawn);
      });
    });
  };

  return (
    <>
      <canvas
        ref={refCanvas}
        data-testid={dataTestId}
        style={{ width: '100%', height: '100%' }}
      />
      <GuiPane
        ref={refDefaultPane}
        name="DEFAULT"
        style={{
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: 'transparent',
          border: 'none',
        }}
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

    (GuiFeature.prototype as any).setAddLog =
      FeatureHandler.prototype.setAddLog;
  }

  setAddLog(addLog: callbackAddLog): void {
    this.addLog = addLog;
  }

  setPartsLayerCollection(partsLayers: GuiPartsLayerCollection) {
    this.partsLayers = partsLayers;
  }

  setTargetPane(pane: Pane) {
    this.targetPane = pane;
  }
}
