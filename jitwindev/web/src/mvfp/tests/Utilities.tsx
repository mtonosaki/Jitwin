// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from '@testing-library/react';
import { FEATURE_EXECUTION_SPAN_MSEC } from '../MvfpParameters';

export type TestInitResult = {
  spyStrokeRect: jest.Mock;
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
