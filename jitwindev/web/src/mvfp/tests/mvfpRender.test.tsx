import React from 'react';
import { act, render, RenderResult } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { FakePart } from './FakePart';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from '../GuiPartsCollection';
import GuiView from '../GuiView';
import { view } from './View';
import FakeFeature from './FakeFeature';
import { GuiFeatureCollection } from '../GuiFeatureCollection';
import { FEATURE_EXECUTION_SPAN_MSEC } from '../MvfpParameters';
import { toBeInTheView, toHaveBeenDrawnAt } from './MvfpToBeXxx';

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

describe('Custom test methods', () => {
  it('.toBeInTheView()', () => {
    const part = new FakePart();
    part.testId = 'test-part-id';
    const layers: GuiPartsLayerCollection = new Map();
    layers.set(0, new GuiPartsCollection());
    layers.get(0)!.push(part);
    mvfpRender(<GuiView partsLayers={layers} />);
    expect(view.getPartByTestId('test-part-id')).toBeInTheView();
  });

  it('.not.toBeInTheView()', () => {
    const part = new FakePart();
    part.testId = 'not-hit-test-part-id';
    const layers: GuiPartsLayerCollection = new Map();
    layers.set(0, new GuiPartsCollection());
    layers.get(0)!.push(part);
    mvfpRender(<GuiView partsLayers={layers} />);
    expect(view.queryPartByTestId('test-part-id')).not.toBeInTheView();
  });
});

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

describe('feature utility', () => {
  it('Bill can test with features and parts layer collection Part 1', () => {
    // GIVEN
    const part1 = new FakePart();
    const part2 = new FakePart();
    const part3 = new FakePart();
    const layers: GuiPartsLayerCollection = new Map();
    layers.set(0, new GuiPartsCollection());

    const feature1 = new FakeFeature([part1]);
    const feature2 = new FakeFeature([part2, part3]);
    const features: GuiFeatureCollection = [feature1, feature2];

    // WHEN
    mvfpRender(<GuiView features={features} partsLayers={layers} />);

    // THEN
    expect(view.features).toBe(features);
    expect(view.features).toHaveLength(2);
    expect(view.features).toContain(feature1);
    expect(view.features).toContain(feature2);
    expect(view.partsLayers).toBe(layers);
    expect(view.partsLayers?.get(0)).toContain(part1);
    expect(view.partsLayers?.get(0)).toContain(part2);
    expect(view.partsLayers?.get(0)).toContain(part3);
  });

  it('Bill can test with features and parts layer collection Part 2', () => {
    // GIVEN
    const part1 = new FakePart();
    const part2 = new FakePart();
    const part3 = new FakePart();
    const part4 = new FakePart();
    const layers: GuiPartsLayerCollection = new Map();
    layers.set(0, new GuiPartsCollection());

    const feature1 = new FakeFeature([part1, part2]);
    const feature2 = new FakeFeature([part3]);
    const feature3 = new FakeFeature([part4]);
    const features: GuiFeatureCollection = [feature1, feature2, feature3];

    // WHEN
    mvfpRender(<GuiView features={features} partsLayers={layers} />);

    // THEN : expecting single instance can be used by multiple test case.
    expect(view.features).toBe(features);
    expect(view.features).toHaveLength(3);
    expect(view.features).toContain(feature1);
    expect(view.features).toContain(feature2);
    expect(view.features).toContain(feature3);
    expect(view.partsLayers).toBe(layers);
    expect(view.partsLayers?.get(0)).toContain(part1);
    expect(view.partsLayers?.get(0)).toContain(part2);
    expect(view.partsLayers?.get(0)).toContain(part3);
    expect(view.partsLayers?.get(0)).toContain(part4);
  });
});
