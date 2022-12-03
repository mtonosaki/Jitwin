import deepEqual from 'deep-equal';
import { MvfpXxxByResult, view } from './View';
import { CodePosition, ScreenPosition } from '../ThreeCoordinatesSystem';

export function toBeInTheView(actual: any): jest.CustomMatcherResult {
  const res = actual as MvfpXxxByResult;
  if (res.foundParts) {
    return {
      message: () =>
        `expected GuiView not to contain part, found ${res.filterName} instead.`,
      pass: true,
    };
  }
  return {
    message: () => `Unable to find an part by: ${res.filterName}`,
    pass: false,
  };
}

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
          `expected position type should be code, layout and screen only: ${res.filterName}`,
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
