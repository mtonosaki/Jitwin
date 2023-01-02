// eslint max-classes-per-file: 0
import { render, screen } from '@testing-library/react';
import { GuiFeature } from 'mvfp/GuiFeature';
import { GuiPart, GuiPartBase } from 'mvfp/GuiPart';
import { DrawProps, Positioner } from 'mvfp/GuiTypes';
import { newLog } from 'mvfp/utils/LogSystem';
import React from 'react';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
  LPSX,
  LPSY,
} from './GuiPartsCollection';
import GuiView from './GuiView';
import FakeFeature from './tests/FakeFeature';
import { FakePart } from './tests/FakePart';
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from './tests/mvfpRender';
import { MvfpTestIds } from './tests/MvfpTestIds';
import SpyFeature from './tests/SpyFeature';
import { view } from './tests/View';
import {
  CodePosition,
  LayoutPosition,
  ScreenPosition,
  screenPosition0,
} from './ThreeCoordinatesSystem';
import { screenOffset } from './utils/coordinateUtils';

describe('Custom html class', () => {
  it('default', () => {
    render(<GuiView />);

    const canvas = screen.getByTestId(MvfpTestIds.VIEW_CANVAS);
    expect(canvas.className).toBe('');
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
    expect(spyPartsLayersCollection.get(0)?.map((it) => it.part)).toContain(
      dummyPartA
    );
    expect(spyPartsLayersCollection.get(0)?.map((it) => it.part)).toContain(
      dummyPartB
    );
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

      getScreenPosition(dp: DrawProps): ScreenPosition {
        return screenPosition0;
      }

      getLayoutPosition(
        positioner: Positioner,
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
    Object.defineProperty(stubCanvas, 'clientHeight', { get: () => 222 });
    Object.defineProperty(stubCanvas, 'width', { set: spyWidthValue });
    Object.defineProperty(stubCanvas, 'height', { set: spyHeightValue });

    // WHEN
    render(<GuiView features={[new FakeFeature([new FakeDrawPart()])]} />);
    await testNextCycleAsync();

    // THEN set canvas size to fix resolution properly.
    expect(spyWidthValue).toHaveBeenCalledWith(111);
    expect(spyHeightValue).toHaveBeenCalledWith(222);
    // AND THEN clear canvas before drawing
    expect(spyClearRect).toHaveBeenCalledWith(0, 0, 111, 222);
    // AND THEN draw parts design
    expect(spyStrokeRect).toHaveBeenCalledWith(100, 200, 300, 400);
  });
});

describe('Pane System', () => {
  it('GuiView have default pane', () => {
    mvfpRender(<GuiView features={[]} />);

    expect(screen.getByTestId(MvfpTestIds.DEFAULT_PANE)).toBeInTheDocument();
    expect(view.getPaneByName('DEFAULT')).toBeInTheView();
  });

  it('Each feature has a target pane, and the default target pane is DEFAULT_PANE', () => {
    // GIVEN
    class TestFeature extends GuiFeature {}

    // WHEN
    const testFeature = new TestFeature();
    mvfpRender(<GuiView features={[testFeature]} />);

    // THEN
    expect(testFeature.pane.name).toBe('DEFAULT');
  });
});

describe('Scroll System', () => {
  it('View can scroll', async () => {
    // GIVEN
    const { stubCanvas } = testInitFeatureCycle();
    Object.defineProperty(stubCanvas, 'clientWidth', { get: () => 111 });
    Object.defineProperty(stubCanvas, 'clientHeight', { get: () => 222 });
    const layers: GuiPartsLayerCollection = new Map();
    const layer = new GuiPartsCollection();
    layers.set(33, layer);
    layer.codeToLayout = {
      convertX(value) {
        return { layout: parseInt(value.code, 16) };
      },
      convertY(value) {
        return { layout: parseInt(value.code, 16) };
      },
    };
    layer.layoutToCode = {
      convertX(value) {
        return { code: value.layout.toString(16) };
      },
      convertY(value) {
        return { code: value.layout.toString(16) };
      },
    };

    class FakeHappyPart extends GuiPartBase<string, string> {
      draw(dp: DrawProps): void {}
    }

    class FakeHappyFeature extends GuiFeature {
      override beforeRun() {
        const part = new FakeHappyPart();
        part.testId = 'happy-parts';
        part.codePosition = {
          x: { code: '111' }, // = 0x111
          y: { code: '222' }, // = 0x222
        };
        this.partsLayers.get(33)!.push({ part, pane: this.pane });
      }
    }

    mvfpRender(
      <GuiView features={[new FakeHappyFeature()]} partsLayers={layers} />
    );
    await testNextCycleAsync();

    // GIVEN  Scroll 0,0
    const samplePart = view.getPartByTestId('happy-parts');
    expect(samplePart).toHaveBeenDrawnAt({
      x: { screen: 0x111 / LPSX }, // 17.0625
      y: { screen: 0x222 / LPSY }, // 34.125
    });

    // WHEN - Scroll View +10, +20
    const def = view.getPaneByName('DEFAULT');
    def.foundPane!.scroll = screenOffset(def.foundPane!.scroll, 10, 20);
    await testNextCycleAsync();

    // THEN
    expect(samplePart).toHaveBeenDrawnAt({
      x: { screen: 0x111 / LPSX + 10 }, // 17.0625 + 10
      y: { screen: 0x222 / LPSY + 20 }, // 34.125 + 20
    });
  });
});

describe('Log System', () => {
  it('Bill can add log message', () => {
    // GIVEN
    class FakeLogFeature extends GuiFeature {
      beforeRun() {
        super.beforeRun();
        this.addLog(newLog('testing information1'));
        this.addLog(newLog('testing information2', 'INF'));
        this.addLog(newLog('testing warning', 'WAR'));
        this.addLog(newLog('testing debug', 'DBG'));
        this.addLog(newLog('testing error', 'ERR'));
      }
    }

    const spyConsoleLog = jest.fn();
    const spyConsoleError = jest.fn();
    console.log = spyConsoleLog; // eslint-disable-line no-console
    console.error = spyConsoleError; // eslint-disable-line no-console
    const stubNow = jest.fn();
    Date.now = stubNow;
    stubNow.mockReturnValueOnce(new Date(2022, 0, 1, 13, 14, 15).getTime());
    stubNow.mockReturnValueOnce(new Date(2022, 3, 14, 14, 14, 16).getTime());
    stubNow.mockReturnValueOnce(new Date(2022, 5, 15, 15, 14, 17).getTime());
    stubNow.mockReturnValueOnce(new Date(2022, 7, 16, 16, 14, 18).getTime());
    stubNow.mockReturnValueOnce(new Date(2022, 9, 23, 17, 14, 19).getTime());

    // WHEN
    mvfpRender(<GuiView features={[new FakeLogFeature()]} />);

    // THEN
    expect(spyConsoleLog).toHaveBeenCalledWith(
      '[I] 13:14:15 testing information1'
    );
    expect(spyConsoleLog).toHaveBeenCalledWith(
      '[I] 14:14:16 testing information2'
    );
    expect(spyConsoleLog).toHaveBeenCalledWith('[W] 15:14:17 testing warning');
    expect(spyConsoleLog).toHaveBeenCalledWith('[D] 16:14:18 testing debug');
    expect(spyConsoleError).toHaveBeenCalledWith('[E] 17:14:19 testing error');
  });

  it('Bill can specify callback of addLog', () => {
    // GIVEN
    class FakeFeatureA extends GuiFeature {
      static expectedLog = newLog('testing information1', 'WAR');

      beforeRun() {
        super.beforeRun();
        this.addLog(FakeFeatureA.expectedLog);
      }
    }
    class FakeFeatureB extends GuiFeature {
      static expectedLog = newLog('testing information2', 'ERR');

      beforeRun() {
        super.beforeRun();
        this.addLog(FakeFeatureB.expectedLog);
      }
    }

    // WHEN
    const spyCallbackAddSpy = jest.fn();
    mvfpRender(
      <GuiView
        features={[new FakeFeatureA(), new FakeFeatureB()]}
        onAddLog={spyCallbackAddSpy}
      />
    );

    // THEN
    expect(spyCallbackAddSpy).toHaveBeenCalledWith(FakeFeatureA.expectedLog);
    expect(spyCallbackAddSpy).toHaveBeenCalledWith(FakeFeatureB.expectedLog);
  });
});
