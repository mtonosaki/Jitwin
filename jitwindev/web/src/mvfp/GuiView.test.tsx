// eslint max-classes-per-file: 0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import GuiView from './GuiView';
import { TestIds } from './tests/TestIds';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import SpyFeature from './tests/SpyFeature';
import { FakePart } from './tests/FakePart';
import { GuiPartsCollection } from './GuiPartsCollection';
import FakeFeature from './tests/FakeFeature';

HTMLCanvasElement.prototype.getContext = jest.fn();

const testInitFeatureCycle = () => {
  jest.useFakeTimers();
};

const testNextCycleAsync = async () =>
  act(async () => {
    jest.advanceTimersByTime(FEATURE_EXECUTION_SPAN_MSEC);
  });

describe('Custom html class', () => {
  it('default', () => {
    render(<GuiView />);

    const canvas = screen.getByTestId(TestIds.MVFP_VIEW_CANVAS);
    expect(canvas.className).toBe('');
  });

  it('set', () => {
    render(<GuiView className="test-class" />);

    const canvas = screen.getByTestId(TestIds.MVFP_VIEW_CANVAS);
    expect(canvas).toHaveClass('test-class');
  });
});

describe('feature.beforeRun', () => {
  it('is kicked from GuiView for feature initializing', () => {
    const feature1 = new SpyFeature();
    const feature2 = new SpyFeature();

    render(<GuiView features={[feature1, feature2]} />);

    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);
    expect(feature2.beforeRun).toHaveBeenCalledTimes(1);
    expect(feature1.run).not.toHaveBeenCalled();
    expect(feature2.run).not.toHaveBeenCalled();
  });

  it('is executed if enabled', () => {
    const feature1 = new SpyFeature();
    const feature2 = new SpyFeature();
    feature2.enabled = false;

    render(<GuiView features={[feature1, feature2]} />);

    expect(feature1.beforeRun).toHaveBeenCalled();
    expect(feature2.beforeRun).not.toHaveBeenCalled();
  });

  it('is executed when switched from disabled to enabled', async () => {
    // GIVEN -1
    testInitFeatureCycle();
    const feature1 = new SpyFeature();
    feature1.enabled = false;

    // WHEN - 1
    render(<GuiView features={[feature1]} />);

    // THEN - 1
    expect(feature1.beforeRun).not.toHaveBeenCalled();

    // GIVEN - 2
    feature1.enabled = true;

    // WHEN - 2
    await testNextCycleAsync();

    // THEN - 2
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);

    // WHEN - 3
    await testNextCycleAsync();

    // THEN - 3
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);

    // GIVEN - 4
    feature1.enabled = false;
    await testNextCycleAsync();
    feature1.enabled = true;

    // WHEN - 4
    await testNextCycleAsync();

    // THEN - 4
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);
  });
});

describe('Parts system', () => {
  it('Features can be injected parts collection', () => {
    // GIVEN
    const spyPartsCollection: GuiPartsCollection = [];
    const dummyPartA = new FakePart();
    const dummyPartB = new FakePart();
    const fakeFeatureA = new FakeFeature([dummyPartA]);
    const fakeFeatureB = new FakeFeature([dummyPartB]);

    // WHEN
    render(
      <GuiView
        features={[fakeFeatureA, fakeFeatureB]}
        parts={spyPartsCollection}
      />
    );

    // THEN
    expect(spyPartsCollection).toHaveLength(2);
    expect(spyPartsCollection).toContain(dummyPartA);
    expect(spyPartsCollection).toContain(dummyPartB);
  });
});

describe('Parts drawing system', () => {
  it('parts.draw have been called', async () => {
    // GIVEN
    testInitFeatureCycle();
    const spyPart = new FakePart();
    spyPart.draw = jest.fn();

    // WHEN
    render(<GuiView features={[new FakeFeature([spyPart])]} parts={[]} />);
    await testNextCycleAsync();

    // THEN
    expect(spyPart.draw).toHaveBeenCalled();
  });

  it('parts draws to canvas context', () => {
    // TODO: implement here
  });
});
