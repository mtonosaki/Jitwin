import { CodePosition, CodeSize, LayoutSize } from './ThreeCoordinatesSystem';

export interface GuiPartPosition<TX, TY> {
  codePosition?: CodePosition<TX, TY>;
  codeSize?: CodeSize<TX, TY>;
  layoutSize?: LayoutSize;
}

export interface GuiPart {
  draw: (g: CanvasRenderingContext2D) => void;
}
