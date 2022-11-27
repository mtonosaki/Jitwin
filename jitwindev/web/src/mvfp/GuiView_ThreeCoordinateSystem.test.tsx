// eslint max-classes-per-file: 0
import React from 'react';
import { render } from '@testing-library/react';
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
import { DrawProps, GuiPartBase } from './GuiPart';
import { GuiFeature } from './GuiFeature';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from './GuiPartsCollection';
import GuiView from './GuiView';
import { testInitFeatureCycle, testNextCycleAsync } from './tests/Utilities';

describe('three coordinate system', () => {
  it('code position can be converted to/from screen position.', async () => {
    // GIVEN
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
    testInitFeatureCycle();
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
