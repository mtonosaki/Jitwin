import { CodeX, CodeY, LayoutX, LayoutY } from '../mvfp/ThreeCoordinatesSystem';
import { UnitDistance } from './SimulationUnit';

const SPACE_UNIT_LOGICAL_PIXEL_X = 100;
const SPACE_UNIT_LOGICAL_PIXEL_Y = 100;

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
