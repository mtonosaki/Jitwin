import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
  ScreenPosition,
} from './ThreeCoordinatesSystem';

export type Converters = {
  codeToLayout: ConverterCodeToLayout;
  layoutToScreen: ConverterLayoutToScreen;
  screenToLayout: ConverterScreenToLayout;
  layoutToCode: ConverterLayoutToCode;
};

export type PaneState = {
  scroll: ScreenPosition;
};

export type DrawProps = {
  g: CanvasRenderingContext2D;
  converters: Converters;
  pane: PaneState;
};
