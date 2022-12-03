import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, RenderResult } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { toBeInTheView, toHaveBeenDrawnAt } from './MvfpToBeXxx';
import { view } from './View';
import { FEATURE_EXECUTION_SPAN_MSEC } from '../MvfpParameters';

expect.extend({
  toBeInTheView,
  toHaveBeenDrawnAt,
});

export type TestInitResult = {
  spyStrokeRect: jest.Mock;
};

export const mvfpRender = (ui: React.ReactElement): RenderResult => {
  const utils = render(<RecoilRoot>{ui}</RecoilRoot>);
  view.features = (global as any).mvfpViewParameter.features;
  view.partsLayers = (global as any).mvfpViewParameter.partsLayers;
  view.refDrawnParts = (global as any).mvfpViewParameter.refDrawnParts;
  return utils;
};

export function testInitFeatureCycle(): TestInitResult {
  const spyStrokeRect = jest.fn();

  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    translate: jest.fn(),
    strokeRect: spyStrokeRect,
  } as any);
  jest.useFakeTimers();

  return { spyStrokeRect };
}

export const testNextCycleAsync = async () =>
  act(async () => {
    jest.advanceTimersByTime(FEATURE_EXECUTION_SPAN_MSEC);
  });
