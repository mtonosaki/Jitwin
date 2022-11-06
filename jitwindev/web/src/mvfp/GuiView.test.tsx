// eslint max-classes-per-file: 0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import GuiView from './GuiView';
import { TestIds } from './tests/TestIds';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import GuiFeature from './GuiFeature';
import SpyFeature from './tests/SpyFeature';

HTMLCanvasElement.prototype.getContext = jest.fn();

const testInitFeatureCycle = () => {
  jest.useFakeTimers();
};

const testNextFeatureCycleAsync = async () =>
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

describe('Utilities', () => {
  it('Returns feature class name', () => {
    // GIVEN - 1
    class DummyFeature extends GuiFeature {}

    // WHEN - 1
    const feature1 = new DummyFeature();

    // THEN -1
    expect(feature1.getName()).toBe('DummyFeature');

    // GIVEN - 2
    class NestedDummyFeature extends DummyFeature {}

    // WHEN - 2
    const feature2 = new NestedDummyFeature();

    // THEN - 2
    expect(feature2.getName()).toBe('NestedDummyFeature');
  });

  it('toString returns feature instance information', () => {
    class DummyFeature extends GuiFeature {}
    const feature1 = new DummyFeature('a01');
    expect(feature1.toString()).toBe('DummyFeature id=a01 enabled');

    feature1.enabled = false;
    expect(feature1.toString()).toBe('DummyFeature id=a01 disabled');
  });
});

describe('BeforeRun', () => {
  it('GuiView initialize features', () => {
    const feature1 = new SpyFeature();
    const feature2 = new SpyFeature();

    render(<GuiView features={[feature1, feature2]} />);

    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);
    expect(feature2.beforeRun).toHaveBeenCalledTimes(1);
    expect(feature1.run).not.toHaveBeenCalled();
    expect(feature2.run).not.toHaveBeenCalled();
  });

  it('Executes if enabled', () => {
    const feature1 = new SpyFeature();
    const feature2 = new SpyFeature();
    feature2.enabled = false;

    render(<GuiView features={[feature1, feature2]} />);

    expect(feature1.beforeRun).toHaveBeenCalled();
    expect(feature2.beforeRun).not.toHaveBeenCalled();
  });

  it('Executes when switched from disabled to enabled', async () => {
    // GIVEN -1
    testInitFeatureCycle();
    const feature1 = new SpyFeature();
    feature1.enabled = false;

    // WHEN - 1
    render(<GuiView data-testid="testView" features={[feature1]} />);

    // THEN - 1
    expect(feature1.beforeRun).not.toHaveBeenCalled();

    // GIVEN - 2
    feature1.enabled = true;

    // WHEN - 2
    await testNextFeatureCycleAsync();

    // THEN - 2
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);

    // WHEN - 3
    await testNextFeatureCycleAsync();

    // THEN - 3
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);

    // GIVEN - 4
    feature1.enabled = false;
    await testNextFeatureCycleAsync();
    feature1.enabled = true;

    // WHEN - 4
    await testNextFeatureCycleAsync();

    // THEN - 4
    expect(feature1.beforeRun).toHaveBeenCalledTimes(1);
  });
});
