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
  CodePosition,
  CodeX,
  CodeY,
  layoutPosition0,
  LayoutX,
  LayoutY,
  screenPosition0,
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
    it('code position can be converted to/from screen position.', async () => {
      testInitFeatureCycle();
      let lx: LayoutX = { layout: 0 };
      let ly: LayoutY = { layout: 0 };
      let sx: ScreenX = { screen: 0 };
      let sy: ScreenY = { screen: 0 };
      let cx: CodeX<string> = { code: 'n/a' };
      let cy: CodeY<number> = { code: 0 };
      let screenPosition = screenPosition0;
      let layoutPosition = layoutPosition0;
      let codePositionS: CodePosition<string, number> = {
        x: { code: 'n/a' },
        y: { code: 0 },
      };
      let codePositionL = codePositionS;

      class PositionConvertTestPart extends GuiPartBase<string, number> {
        override draw(dp: DrawProps): void {
          if (!this.codePosition) return;
          lx = dp.codeToLayout.convertX(this.codePosition.x);
          ly = dp.codeToLayout.convertY(this.codePosition.y);
          sx = dp.layoutToScreen.convertX(lx);
          sy = dp.layoutToScreen.convertY(ly);
          screenPosition = this.getScreenPosition(dp);
          layoutPosition = this.getLayoutPosition(dp, screenPosition);
          codePositionL = this.getCodePosition(dp, layoutPosition);
          codePositionS = this.getCodePositionFromScreen(dp, screenPosition);
          const lx2 = dp.screenToLayout.convertX(sx);
          const ly2 = dp.screenToLayout.convertY(sy);
          cx = dp.layoutToCode.convertX(lx2);
          cy = dp.layoutToCode.convertY(ly2);
        }
      }

      const testPart = new PositionConvertTestPart();
      const expectedCodeX = 'one';
      const expectedCodeY = 2;
      testPart.codePosition = {
        x: { code: expectedCodeX },
        y: { code: expectedCodeY },
      };

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
      layer.screenToLayout = {
        convertX(value) {
          return { layout: value.screen / 100 };
        },
        convertY(value) {
          return { layout: value.screen / 1000 };
        },
      };
      layer.layoutToCode = {
        convertX(value) {
          switch (value.layout) {
            case 1:
              return { code: 'one' };
            case 2:
              return { code: 'two' };
            case 3:
              return { code: 'three' };
            default:
              return { code: 'n/a' };
          }
        },
        convertY(value) {
          return { code: value.layout / 2 };
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
      expect(screenPosition.x.screen).toBe(100);
      expect(screenPosition.y.screen).toBe(4000);
      expect(layoutPosition.x.layout).toBe(1);
      expect(layoutPosition.y.layout).toBe(4);
      expect(codePositionS.x.code).toBe(expectedCodeX);
      expect(codePositionS.y.code).toBe(expectedCodeY);
      expect(codePositionL.x.code).toBe(expectedCodeX);
      expect(codePositionL.y.code).toBe(expectedCodeY);
      expect(cx.code).toBe(expectedCodeX);
      expect(cy.code).toBe(expectedCodeY);
    });
  });
});
