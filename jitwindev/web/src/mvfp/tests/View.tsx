import { Positioner } from 'mvfp/GuiTypes';
import { DrawnPart } from 'mvfp/GuiView';
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
  foundPositioner?: Positioner;
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

    if (view.refDrawnParts) {
      for (const drawnPart of view.refDrawnParts.current) {
        if (drawnPart.part.testId === testId) {
          return {
            method,
            filterName,
            foundParts: drawnPart.part,
            foundLayer: drawnPart.layer,
            foundPositioner: drawnPart.positioner,
            foundPane: drawnPart.positioner.pane,
          };
        }
      }
    }

    // @ts-ignore
    for (const layerNo: number of view.partsLayers.keys()) {
      const layer = view.partsLayers.get(layerNo);
      const filter = layer?.filter(
        (partPane) => partPane.part.testId === testId
      );
      if ((filter?.length ?? 0) > 0) {
        return {
          method,
          filterName,
          foundParts: filter![0].part,
          foundPane: filter![0].pane,
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
  refDrawnParts?: React.MutableRefObject<DrawnPart[]>;
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
