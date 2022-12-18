import React from 'react';
import { GuiFeatureCollection } from '../GuiFeatureCollection';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from '../GuiPartsCollection';
import { GuiPart } from '../GuiPart';
import { GuiPane, Pane } from '../GuiPane';

export type MvfpXxxByResult = {
  method: string;
  filterName: string;
  foundParts?: GuiPart;
  foundLayer?: GuiPartsCollection;
  foundPane?: Pane;
};

export const xxxPaneByName =
  (method: string) =>
  (name: string): MvfpXxxByResult => {
    const filterName = `[GuiPane.name="${name}"]`;
    if (name === 'DEFAULT') {
      const pane = view.refDefaultPane?.current;
      return { method, filterName, foundPane: pane };
    }
    return { method, filterName, foundPane: undefined };
  };

export const xxxPartByTestId =
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
  refDefaultPane?: React.MutableRefObject<GuiPane>;
  getPartByTestId: (testId: string) => MvfpXxxByResult;
  queryPartByTestId: (testId: string) => MvfpXxxByResult;
  getPaneByName: (name: string) => MvfpXxxByResult;
};

export const view: MvfpRenderResult = {
  getPartByTestId: xxxPartByTestId('getPartByTestId'),
  queryPartByTestId: xxxPartByTestId('queryPartByTestId'),
  getPaneByName: xxxPaneByName('getPaneByName'),
};
