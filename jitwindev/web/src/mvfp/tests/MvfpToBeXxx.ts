import { MvfpXxxByResult, view } from './View';
import { ScreenPosition } from '../ThreeCoordinatesSystem';

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

export function toHaveBeenDrawnAt(
  actual: any,
  expect: any
): jest.CustomMatcherResult {
  const res = actual as MvfpXxxByResult;
  if (res.foundParts && res.foundLayer) {
    if (view.refDrawnParts?.current.includes(res.foundParts)) {
      const expectedScreenPosition = ifScreenPosition(expect);
      if (expectedScreenPosition) {
        const actualScreenPosition = res.foundParts.getScreenPosition(
          res.foundLayer.getConverters()
        );
        if (
          actualScreenPosition.x.screen !== expectedScreenPosition.x.screen ||
          actualScreenPosition.y.screen !== expectedScreenPosition.y.screen
        ) {
          return {
            message: () =>
              `screen position expect(${expectedScreenPosition.x.screen}, ${expectedScreenPosition.x.screen}) not equals to actual(${actualScreenPosition.x.screen}, ${actualScreenPosition.y.screen}) of ${res.filterName}`,
            pass: false,
          };
        }
      }

      return {
        message: () =>
          `expected GuiView not to contain part, found ${res.filterName} instead.`,
        pass: true,
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
