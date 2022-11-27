// eslint max-classes-per-file: 0
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import GuiView from './GuiView';
import { TestIds } from './tests/TestIds';
import { FEATURE_EXECUTION_SPAN_MSEC } from './MvfpParameters';
import SpyFeature from './tests/SpyFeature';
import { FakePart } from './tests/FakePart';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from './GuiPartsCollection';
import FakeFeature from './tests/FakeFeature';
import { DrawProps, GuiPart, GuiPartBase } from './GuiPart';
import { drawRectangle } from './drawSet';
import { GuiFeature } from './GuiFeature';
import {
  LayoutX,
  LayoutY,
  ScreenPosition,
  ScreenX,
  ScreenY,
} from './ThreeCoordinatesSystem';

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
    jest
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({} as RenderingContext);
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

describe('three coordinate system', () => {
  it('can convert from code to layout coordinate', () => {
    // GIVEN
  });
});

describe('Parts drawing system', () => {
  const spyStrokeRect = jest.fn();
  beforeEach(() => {
    spyStrokeRect.mockReset();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      translate: jest.fn(),
      strokeRect: spyStrokeRect,
    } as any);
  });
  it('parts.draw have been called', async () => {
    // GIVEN
    testInitFeatureCycle();
    const spyPart = new FakePart();
    spyPart.draw = jest.fn();

    // WHEN
    render(<GuiView features={[new FakeFeature([spyPart])]} />);
    await testNextCycleAsync();

    // THEN
    expect(spyPart.draw).toHaveBeenCalled();
  });

  it('parts draws to canvas context', async () => {
    // GIVEN
    testInitFeatureCycle();

    class FakeDrawPart implements GuiPart {
      draw({ g }: DrawProps): void {
        drawRectangle(g, 100, 200, 300, 400);
      }
    }

    // WHEN
    render(<GuiView features={[new FakeFeature([new FakeDrawPart()])]} />);
    await testNextCycleAsync();

    // THEN
    expect(spyStrokeRect).toHaveBeenCalled();
  });

  describe('three coordinate system', () => {
    it('code position can be converted to screen position.', async () => {
      testInitFeatureCycle();
      let lx: LayoutX = { layout: 0 };
      let ly: LayoutY = { layout: 0 };
      let sx: ScreenX = { screen: 0 };
      let sy: ScreenY = { screen: 0 };
      let spos: ScreenPosition = { x: { screen: 0 }, y: { screen: 0 } };
      class PositionConvertTestPart extends GuiPartBase<string, number> {
        override draw(dp: DrawProps): void {
          if (!this.codePosition) return;
          lx = dp.codeToLayout.convertX(this.codePosition.x);
          ly = dp.codeToLayout.convertY(this.codePosition.y);
          sx = dp.layoutToScreen.convertX(lx);
          sy = dp.layoutToScreen.convertY(ly);
          spos = this.getScreenPosition(dp);
        }
      }
      const testPart = new PositionConvertTestPart();
      testPart.codePosition = { x: { code: 'one' }, y: { code: 2 } };
      class MockFeature extends GuiFeature {
        override beforeRun() {
          this.partsLayers.get(0)?.push(testPart);
        }
      }
      function mockCodeToLayoutX(value: any): LayoutX {
        switch (value.code) {
          case 'one':
            return { layout: 1 };
          case 'two':
            return { layout: 2 };
          case 'three':
            return { layout: 3 };
          default:
            return { layout: 0 };
        }
      }

      const layers: GuiPartsLayerCollection = new Map();
      layers.set(0, new GuiPartsCollection());
      const layer = layers.get(0)!;
      layer.codeToLayout = {
        convertX: mockCodeToLayoutX,
        convertY(value) {
          return { layout: (value.code as number) * 2 };
        },
      };
      layer.layoutToScreen = {
        convertX(value) {
          return { screen: value.layout * 100 };
        },
        convertY(value) {
          return { screen: value.layout * 1000 };
        },
      };

      // WHEN
      render(<GuiView features={[new MockFeature()]} partsLayers={layers} />);
      await testNextCycleAsync();

      // THEN
      expect(lx.layout).toBe(1);
      expect(ly.layout).toBe(4);
      expect(sx.screen).toBe(100);
      expect(sy.screen).toBe(4000);
      expect(spos.x.screen).toBe(100);
      expect(spos.y.screen).toBe(4000);
    });
  });
});
