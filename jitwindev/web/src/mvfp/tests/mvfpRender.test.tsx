import React from 'react';
import { FakePart } from './FakePart';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from '../GuiPartsCollection';
import GuiView from '../GuiView';
import { view } from './View';
import FakeFeature from './FakeFeature';
import { GuiFeatureCollection } from '../GuiFeatureCollection';
import { mvfpRender } from './mvfpRender';

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
