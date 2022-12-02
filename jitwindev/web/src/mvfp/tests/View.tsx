import React from 'react';
import { GuiFeatureCollection } from '../GuiFeatureCollection';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from '../GuiPartsCollection';
import { GuiPart } from '../GuiPart';

export type MvfpXxxByResult = {
  method: string;
  filterName: string;
  foundParts?: GuiPart;
  foundLayer?: GuiPartsCollection;
};

export const xxxByPartTestId =
  (method: string) =>
  (testId: string): MvfpXxxByResult => {
    const filterName = `[GuiPart.id="${testId}"]`;
    if (!view.partsLayers) {
      return {
        method,
        filterName,
      };
    }
    // @ts-ignore
    for (const layerNo: number of view.partsLayers.keys()) {
      const layer = view.partsLayers.get(layerNo);
      const filter = layer?.filter((part) => part.testId === testId);
      if ((filter?.length ?? 0) > 0) {
        return {
          method,
          filterName,
          foundParts: filter![0],
          foundLayer: layer,
        };
      }
    }
    return {
      method,
      filterName,
    };
  };

export type MvfpRenderResult = {
  features?: GuiFeatureCollection;
  partsLayers?: GuiPartsLayerCollection;
  refDrawnParts?: React.MutableRefObject<any[]>;
  getPartByTestId: (testId: string) => MvfpXxxByResult;
  queryPartByTestId: (testId: string) => MvfpXxxByResult;
};

export const view: MvfpRenderResult = {
  getPartByTestId: xxxByPartTestId('getByPartTestId'),
  queryPartByTestId: xxxByPartTestId('queryByPartTestId'),
};
