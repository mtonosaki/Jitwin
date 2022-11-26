import { GuiPart, GuiPartPosition } from '../GuiPart';
import { CodePosition, CodeSize } from '../ThreeCoordinatesSystem';

export class PartRectangle<TX, TY> implements GuiPart, GuiPartPosition<TX, TY> {
  codePosition?: CodePosition<TX, TY>;

  codeSize?: CodeSize<TX, TY>;

  draw(g: CanvasRenderingContext2D): void {}
}
