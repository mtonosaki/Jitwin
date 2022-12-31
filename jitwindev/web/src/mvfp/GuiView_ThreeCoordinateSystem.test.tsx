// eslint max-classes-per-file: 0
import { fakePaneState } from 'mvfp/tests/Fakes';
import React from 'react';
import { render } from '@testing-library/react';
import { GuiPartBase } from 'mvfp/GuiPart';
import { DrawProps } from 'mvfp/GuiTypes';
import { LayoutX, screenPosition0 } from './ThreeCoordinatesSystem';
import { GuiFeature } from './GuiFeature';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
  LPS,
} from './GuiPartsCollection';
import GuiView from './GuiView';
import { testInitFeatureCycle, testNextCycleAsync } from './tests/mvfpRender';

describe('three coordinate system', () => {
  it('code position can be converted to/from screen position.', async () => {
    // GIVEN
    class MockPart extends GuiPartBase<string, number> {
      dp?: DrawProps;

      override draw(dp: DrawProps): void {
        this.dp = dp;
      }

      public verifyBetweenCodeAndLayout(): void {
        if (!this.codePosition) return;
        const lx = this.dp!.converters.codeToLayout.convertX({ code: 'one' });
        const ly = this.dp!.converters.codeToLayout.convertY({ code: 2 });
        const cx = this.dp!.converters.layoutToCode.convertX(lx);
        const cy = this.dp!.converters.layoutToCode.convertY(ly);

        expect(lx.layout).toBe(1);
        expect(ly.layout).toBe(4);
        expect(cx.code).toBe('one');
        expect(cy.code).toBe(2);
      }

      public verifyBetweenLayoutAndScreen(): void {
        const sx = this.dp!.converters.layoutToScreen.convertX(
          { layout: 1 },
          fakePaneState,
          true
        );
        const sy = this.dp!.converters.layoutToScreen.convertY(
          { layout: 4 },
          {
            name: '',
            scroll: screenPosition0,
            paneSize: { width: { screen: 0 }, height: { screen: 0 } },
          },
          true
        );
        const lx = this.dp!.converters.screenToLayout.convertX(
          sx,
          this.dp!.pane,
          true
        );
        const ly = this.dp!.converters.screenToLayout.convertY(
          sy,
          this.dp!.pane,
          true
        );

        expect(lx.layout).toBe(1);
        expect(ly.layout).toBe(4);
        expect(sx.screen).toBe(1 / LPS);
        expect(sy.screen).toBe(4 / LPS);
      }

      public verifyGetHogePosition(): void {
        const screenPosition = this.getScreenPosition(this.dp!); // from Code
        expect(screenPosition.x.screen).toBe(1 / LPS);
        expect(screenPosition.y.screen).toBe(4 / LPS);

        const layoutPosition = this.getLayoutPosition(this.dp!, screenPosition);
        expect(layoutPosition.x.layout).toBe(1);
        expect(layoutPosition.y.layout).toBe(4);

        const codePositionFromLayout = this.getCodePosition(
          this.dp!.converters,
          layoutPosition
        );
        expect(codePositionFromLayout.x.code).toBe('one');
        expect(codePositionFromLayout.y.code).toBe(2);

        const codePositionFromScreen = this.getCodePositionFromScreen(
          this.dp!,
          screenPosition
        );
        expect(codePositionFromScreen.x.code).toBe('one');
        expect(codePositionFromScreen.y.code).toBe(2);
      }
    }

    class HavingMockedPartFeature extends GuiFeature {
      private mockPart = new MockPart();

      override beforeRun() {
        // add the part into common collection
        this.partsLayers
          .get(0)
          ?.push({ part: this.mockPart, pane: fakePaneState });
        this.mockPart.codePosition = {
          x: { code: 'one' },
          y: { code: 2 },
        };
      }

      public verifyBetweenCodeAndLayout(): void {
        this.mockPart.verifyBetweenCodeAndLayout();
      }

      public verifyBetweenLayoutAndScreen(): void {
        this.mockPart.verifyBetweenLayoutAndScreen();
      }

      public verifyGetHogePosition(): void {
        this.mockPart.verifyGetHogePosition();
      }
    }

    function stubCodeToLayoutX(value: any): LayoutX {
      switch (value.code) {
        case 'one':
          return { layout: 1 };
        default:
          return { layout: 0 };
      }
    }

    // make part collection layer
    const layers: GuiPartsLayerCollection = new Map();
    layers.set(0, new GuiPartsCollection());
    const layer = layers.get(0)!;
    layer.codeToLayout = {
      // set function version
      convertX: stubCodeToLayoutX,

      // set anonymous function version
      convertY(value) {
        return { layout: (value.code as number) * 2 };
      },
    };
    layer.layoutToCode = {
      convertX(value) {
        switch (Math.floor(value.layout)) {
          case 1:
            return { code: 'one' };
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
    const havingMockedPartFeature = new HavingMockedPartFeature();
    render(
      <GuiView features={[havingMockedPartFeature]} partsLayers={layers} />
    );
    await testNextCycleAsync();

    // THEN
    havingMockedPartFeature.verifyBetweenCodeAndLayout();
    havingMockedPartFeature.verifyBetweenLayoutAndScreen();
    havingMockedPartFeature.verifyGetHogePosition();
  });
});
