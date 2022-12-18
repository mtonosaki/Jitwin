import deepEqual from 'deep-equal';
import { MvfpXxxByResult, view } from './View';
import {
  CodePosition,
  LayoutPosition,
  ScreenPosition,
} from '../ThreeCoordinatesSystem';

export function toBeInTheView(actual: any): jest.CustomMatcherResult {
  const res = actual as MvfpXxxByResult;
  if (res.foundParts) {
    return {
      message: () =>
        `expected GuiView not to contain part, found ${res.filterName} instead.`,
      pass: true,
    };
  }

  // [GuiPane.name="DEFAULT"]   1:GuiPane  2:name  3: DEFAULT   0:[GuiPane.name="DEFAULT"]
  const command = /^\[(.+)\.(.+)="(.+)"\]$/.exec(res.filterName);
  if (command && command[1] === 'GuiPane' && command[2] === 'name') {
    const actualPaneName = command[3];
    if (res.foundPane?.getName() === actualPaneName) {
      return {
        message: () =>
          `expected GuiPane not to contain pane, found ${res.filterName} instead.`,
        pass: true,
      };
    }
    return {
      message: () => `Unable to find an pane by: ${res.filterName}`,
      pass: false,
    };
  }

  return {
    message: () => `Unable to find an part by: ${res.filterName}`,
    pass: false,
  };
}

const ifLayoutPosition = (pos: any): LayoutPosition | undefined => {
  if ('x' in pos && 'layout' in pos.x) {
    return pos as LayoutPosition;
  }
  return undefined;
};

const ifScreenPosition = (pos: any): ScreenPosition | undefined => {
  if ('x' in pos && 'screen' in pos.x) {
    return pos as ScreenPosition;
  }
  return undefined;
};

const ifCodePosition = (pos: any): CodePosition<any, any> | undefined => {
  if ('x' in pos && 'code' in pos.x) {
    return pos as CodePosition<any, any>;
  }
  return undefined;
};

export function toHaveBeenDrawnAt(
  actual: any,
  expect: any
): jest.CustomMatcherResult {
  const res = actual as MvfpXxxByResult;
  if (res.foundParts && res.foundLayer) {
    if (view.refDrawnParts?.current.includes(res.foundParts)) {
      const expectLayoutPosition = ifLayoutPosition(expect);
      if (expectLayoutPosition) {
        const c2l = res.foundLayer.getConverters().codeToLayout;
        const actualCodePosition = res.foundParts.peekCodePositionAsAny();
        const actualLayoutPosition: LayoutPosition = {
          x: { layout: c2l.convertX(actualCodePosition.x).layout },
          y: { layout: c2l.convertY(actualCodePosition.y).layout },
        };
        if (
          actualLayoutPosition.x.layout === expectLayoutPosition.x.layout &&
          actualLayoutPosition.y.layout === expectLayoutPosition.y.layout
        ) {
          return {
            message: () =>
              `expecting not same layout position (${expectLayoutPosition.x.layout}, ${expectLayoutPosition.y.layout}) but it is same.`,
            pass: true,
          };
        }
        return {
          message: () =>
            `layout position expect(${expectLayoutPosition.x.layout}, ${expectLayoutPosition.y.layout}) not equals to actual(${actualLayoutPosition.x.layout}, ${actualLayoutPosition.y.layout}) of ${res.filterName}`,
          pass: false,
        };
      }

      const expectScreenPosition = ifScreenPosition(expect);
      if (expectScreenPosition) {
        const actualScreenPosition = res.foundParts.getScreenPosition(
          res.foundLayer.getConverters()
        );
        if (
          actualScreenPosition.x.screen === expectScreenPosition.x.screen &&
          actualScreenPosition.y.screen === expectScreenPosition.y.screen
        ) {
          return {
            message: () =>
              `expecting not same screen position (${expectScreenPosition.x.screen}, ${expectScreenPosition.y.screen}) but it is same.`,
            pass: true,
          };
        }
        return {
          message: () =>
            `screen position expect(${expectScreenPosition.x.screen}, ${expectScreenPosition.y.screen}) not equals to actual(${actualScreenPosition.x.screen}, ${actualScreenPosition.y.screen}) of ${res.filterName}`,
          pass: false,
        };
      }

      const expectCodePosition = ifCodePosition(expect);
      if (expectCodePosition) {
        const actualCodePosition = res.foundParts.peekCodePositionAsAny();
        if (
          deepEqual(actualCodePosition.x.code, expectCodePosition.x.code) &&
          deepEqual(actualCodePosition.y.code, expectCodePosition.y.code)
        ) {
          return {
            message: () =>
              `expecting not same code position (${JSON.stringify(
                expectCodePosition.x.code
              )}, ${JSON.stringify(
                expectCodePosition.y.code
              )}) but it is same.`,
            pass: true,
          };
        }
        return {
          message: () =>
            `code position expect(${JSON.stringify(
              expectCodePosition.x.code
            )}, ${JSON.stringify(
              expectCodePosition.y.code
            )}) not equals to actual(${JSON.stringify(
              actualCodePosition.x.code
            )}, ${JSON.stringify(actualCodePosition.y.code)}) of ${
              res.filterName
            }`,
          pass: false,
        };
      }

      return {
        message: () =>
          'executable position type should be code, layout or screen only',
        pass: false,
      };
    }
    return {
      message: () => `have not been drawn with: ${res.filterName}`,
      pass: false,
    };
  }
  return {
    message: () => `Unable to find an part by: ${res.filterName}`,
    pass: false,
  };
}
