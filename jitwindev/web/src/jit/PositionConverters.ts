import {
  CodeX,
  CodeY,
  LayoutX,
  LayoutY,
  ScreenX,
  ScreenY,
} from '../mvfp/ThreeCoordinatesSystem';
import { UnitDistance } from './SimulationUnit';

export const SPACE_UNIT_LOGICAL_PIXEL_X = 100;
export const SPACE_UNIT_LOGICAL_PIXEL_Y = 100;

export function codeToLayoutLogicalSpaceX(value: CodeX<UnitDistance>): LayoutX {
  return { layout: value.code.m * SPACE_UNIT_LOGICAL_PIXEL_X };
}

export function codeToLayoutLogicalSpaceY(value: CodeY<UnitDistance>): LayoutY {
  return { layout: value.code.m * SPACE_UNIT_LOGICAL_PIXEL_Y };
}

export function layoutToCodeLogicalSpaceX(value: LayoutX): CodeX<UnitDistance> {
  return { code: { m: value.layout / SPACE_UNIT_LOGICAL_PIXEL_X } };
}

export function layoutToCodeLogicalSpaceY(value: LayoutY): CodeY<UnitDistance> {
  return { code: { m: value.layout / SPACE_UNIT_LOGICAL_PIXEL_Y } };
}

export function layoutToScreenX(value: LayoutX): ScreenX {
  return { screen: value.layout };
}

export function layoutToScreenY(value: LayoutY): ScreenY {
  return { screen: value.layout };
}

export function screenToLayoutX(value: ScreenX): LayoutX {
  return { layout: value.screen };
}

export function screenToLayoutY(value: ScreenY): LayoutY {
  return { layout: value.screen };
}
