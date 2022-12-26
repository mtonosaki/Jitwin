import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
  PaneState,
} from './ThreeCoordinatesSystem';

export type Converters = {
  codeToLayout: ConverterCodeToLayout;
  layoutToScreen: ConverterLayoutToScreen;
  screenToLayout: ConverterScreenToLayout;
  layoutToCode: ConverterLayoutToCode;
};

export type Positioner = {
  converters: Converters;
  pane: PaneState;
};

export type DrawProps = {
  g: CanvasRenderingContext2D;
  converters: Converters;
  pane: PaneState;
};
