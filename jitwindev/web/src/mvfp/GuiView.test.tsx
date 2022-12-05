// eslint max-classes-per-file: 0
import React from 'react';
import { render, screen } from '@testing-library/react';
import GuiView from './GuiView';
import { MvfpTestIds } from './tests/MvfpTestIds';
import SpyFeature from './tests/SpyFeature';
import { FakePart } from './tests/FakePart';
import { GuiPartsLayerCollection } from './GuiPartsCollection';
import FakeFeature from './tests/FakeFeature';
import { Converters, DrawProps, GuiPart } from './GuiPart';
import { view } from './tests/View';
import {
  CodePosition,
  LayoutPosition,
  ScreenPosition,
  screenPosition0,
} from './ThreeCoordinatesSystem';
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from './tests/mvfpRender';

describe('Custom html class', () => {
  it('default', () => {
    render(<GuiView />);

    const canvas = screen.getByTestId(MvfpTestIds.VIEW_CANVAS);
    expect(canvas.className).toBe('');
  });

  it('set', () => {
    render(<GuiView className="test-class" />);

    const canvas = screen.getByTestId(MvfpTestIds.VIEW_CANVAS);
    expect(canvas).toHaveClass('test-class');
  });
});

describe('feature.beforeRun', () => {
  it('is kicked from GuiView for feature initializing', () => {
    const feature1 = new SpyFeature();
    const feature2 = new SpyFeature();

    mvfpRender(<GuiView features={[feature1, feature2]} />);
    expect(view.features).toHaveLength(2);

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
  it('Features must have the same parts collection', () => {
    // GIVEN
    const spyPartsLayersCollection: GuiPartsLayerCollection = new Map();
    const dummyPartA = new FakePart();
    const dummyPartB = new FakePart();
    const fakeFeatureA = new FakeFeature([dummyPartA]);
    const fakeFeatureB = new FakeFeature([dummyPartB]);

    // WHEN
    render(
      <GuiView
        features={[fakeFeatureA, fakeFeatureB]}
        partsLayers={spyPartsLayersCollection}
      />
    );

    // THEN
    expect(spyPartsLayersCollection.get(0)).toHaveLength(2);
    expect(spyPartsLayersCollection.get(0)).toContain(dummyPartA);
    expect(spyPartsLayersCollection.get(0)).toContain(dummyPartB);
  });
});

describe('Parts drawing system', () => {
  it('parts.draw have been called', async () => {
    // GIVEN
    const spyPart = new FakePart();
    spyPart.draw = jest.fn();

    // WHEN
    testInitFeatureCycle();
    render(<GuiView features={[new FakeFeature([spyPart])]} />);
    await testNextCycleAsync();

    // THEN
    expect(spyPart.draw).toHaveBeenCalled();
  });

  it('parts draws to canvas context', async () => {
    // GIVEN
    class FakeDrawPart implements GuiPart {
      testId: string | undefined;

      draw({ g }: DrawProps): void {
        g.strokeStyle = 'rgb(1,2,3)';
        g.strokeRect(100, 200, 300, 400);
      }

      getScreenPosition(converters: Converters): ScreenPosition {
        return screenPosition0;
      }

      getLayoutPosition(
        converters: Converters,
        screenPosition: ScreenPosition
      ): LayoutPosition {
        return { x: { layout: 0 }, y: { layout: 0 } };
      }

      peekCodePositionAsAny(): CodePosition<any, any> {
        return { x: { code: 0 }, y: { code: 0 } };
      }
    }
    const { stubCanvas, spyStrokeRect, spyClearRect } = testInitFeatureCycle();
    const spyWidthValue = jest.fn();
    const spyHeightValue = jest.fn();
    Object.defineProperty(stubCanvas, 'clientWidth', { get: () => 111 });
    Object.defineProperty(stubCanvas, 'width', { set: spyWidthValue });
    Object.defineProperty(stubCanvas, 'clientHeight', { get: () => 222 });
    Object.defineProperty(stubCanvas, 'height', { set: spyHeightValue });

    // WHEN
    render(<GuiView features={[new FakeFeature([new FakeDrawPart()])]} />);
    await testNextCycleAsync();

    // THEN
    expect(spyStrokeRect).toHaveBeenCalledWith(100, 200, 300, 400);
    expect(spyClearRect).toHaveBeenCalledWith(0, 0, 111, 222);
    expect(spyWidthValue).toHaveBeenCalledWith(111);
    expect(spyHeightValue).toHaveBeenCalledWith(222);
  });
});
