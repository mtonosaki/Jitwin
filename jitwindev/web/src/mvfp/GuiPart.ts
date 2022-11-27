import {
  CodePosition,
  CodeSize,
  ConverterCodeToLayout,
  ConverterLayoutToScreen,
  ScreenPosition,
} from './ThreeCoordinatesSystem';
import { GuiUndefinedException } from './GuiExeption';

export interface GuiPartPosition<TX, TY> {
  codePosition?: CodePosition<TX, TY>;
  codeSize?: CodeSize<TX, TY>;
}

export type DrawProps = {
  g: CanvasRenderingContext2D;
  codeToLayout: ConverterCodeToLayout;
  layoutToScreen: ConverterLayoutToScreen;
};

export interface GuiPart {
  draw(dp: DrawProps): void;
}

export abstract class GuiPartBase<TX, TY>
  implements GuiPart, GuiPartPosition<TX, TY>
{
  codePosition?: CodePosition<TX, TY>;

  codeSize?: CodeSize<TX, TY>;

  abstract draw(dp: DrawProps): void;

  getScreenPosition(dp: DrawProps): ScreenPosition {
    if (!this.codePosition)
      throw new GuiUndefinedException('GuiParts.getScreenPosition');

    const lx = dp.codeToLayout.convertX(this.codePosition.x);
    const ly = dp.codeToLayout.convertY(this.codePosition.y);
    const sx = dp.layoutToScreen.convertX(lx);
    const sy = dp.layoutToScreen.convertY(ly);
    return { x: sx, y: sy };
  }
}
