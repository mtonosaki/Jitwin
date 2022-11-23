// eslint max-classes-per-file: 0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import GuiView from './GuiView';
import { TestIds } from './tests/TestIds';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import { GuiFeature } from './GuiFeature';
import SpyFeature from './tests/SpyFeature';
import { FakePart } from './tests/FakePart';
import { GuiPartsCollectionImpl } from './GuiPartsCollection';

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
    render(<GuiView features={[feature1]} />);

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

describe('Parts system', () => {
  it('Features can be injected parts collection', () => {
    // GIVEN
    const spyPartsCollection = new GuiPartsCollectionImpl();
    const dummyPartA = new FakePart();
    const dummyPartB = new FakePart();
    class FakeFeatureA extends GuiFeature {
      override beforeRun() {
        super.beforeRun();
        this.parts.add(dummyPartA);
      }
    }
    class FakeFeatureB extends GuiFeature {
      override beforeRun() {
        super.beforeRun();
        this.parts.add(dummyPartB);
      }
    }

    // WHEN
    render(
      <GuiView
        features={[new FakeFeatureA(), new FakeFeatureB()]}
        parts={spyPartsCollection}
      />
    );

    // THEN
    expect(spyPartsCollection.getCount()).toBe(2);
    expect(spyPartsCollection.contains(dummyPartA)).toBeTruthy();
    expect(spyPartsCollection.contains(dummyPartB)).toBeTruthy();
  });
});
