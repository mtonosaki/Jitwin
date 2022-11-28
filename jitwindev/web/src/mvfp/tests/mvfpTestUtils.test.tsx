/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { act, render } from '@testing-library/react';
import { FEATURE_EXECUTION_SPAN_MSEC } from '../MvfpParameters';
import GuiView from '../GuiView';
import { GuiFeatureCollection } from '../GuiFeatureCollection';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from '../GuiPartsCollection';
import FakeFeature from './FakeFeature';
import { FakePart } from './FakePart';

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

type Found = {
  features?: GuiFeatureCollection;
  partsLayers?: GuiPartsLayerCollection;
};

type FindProps = {
  ui: React.ReactElement;
  found: Found;
};

const findGuiView = ({ ui, found }: FindProps): void => {
  if (ui.type && typeof ui.type === 'function') {
    if (ui.type.name === 'GuiView') {
      found.features = ui.props.features;
      found.partsLayers = ui.props.partsLayers;
    }
  }
  React.Children.forEach(ui.props.children, (child) => {
    if (child.type) {
      findGuiView({ ui: child, found });
    }
  });
};

export const view: Found = {};

export const mvfpRender = (ui: React.ReactElement) => {
  render(ui);
  view.features = undefined;
  view.partsLayers = undefined;
  findGuiView({ ui, found: view });
};

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
