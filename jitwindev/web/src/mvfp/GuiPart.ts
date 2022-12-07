import { Converters, DrawProps } from 'mvfp/GuiTypes';
import {
  CodePosition,
  CodeSize,
  LayoutPosition,
  ScreenPosition,
  ScreenSize,
} from './ThreeCoordinatesSystem';
import { GuiUndefinedException } from './GuiExeption';

export interface GuiPartPosition<TCodeX, TCodeY> {
  codePosition?: CodePosition<TCodeX, TCodeY>;
  codeSize?: CodeSize<TCodeX, TCodeY>;
}

export interface GuiPart {
  testId: string | undefined;

  draw(dp: DrawProps): void;

  getScreenPosition(converters: Converters): ScreenPosition;

  getLayoutPosition(
    converters: Converters,
    screenPosition: ScreenPosition
  ): LayoutPosition;

  peekCodePositionAsAny(): CodePosition<any, any>;
}

export abstract class GuiPartBase<TCodeX, TCodeY>
  implements GuiPart, GuiPartPosition<TCodeX, TCodeY>
{
  public testId: string | undefined;

  public codePosition?: CodePosition<TCodeX, TCodeY>;

  public abstract draw(dp: DrawProps): void;

  public peekCodePositionAsAny(): CodePosition<any, any> {
    return {
      x: { code: this.codePosition?.x.code },
      y: { code: this.codePosition?.y.code },
    };
  }

  public getScreenPosition(converters: Converters): ScreenPosition {
    if (!this.codePosition)
      throw new GuiUndefinedException('GuiParts.getScreenPosition');

    return this.getScreenPositionFromCode(converters, this.codePosition);
  }

  public getScreenPositionFromCode(
    converters: Converters,
    codePosition: CodePosition<TCodeX, TCodeY>
  ): ScreenPosition {
    const lx = converters.codeToLayout.convertX(codePosition.x);
    const ly = converters.codeToLayout.convertY(codePosition.y);
    const sx = converters.layoutToScreen.convertX(lx);
    const sy = converters.layoutToScreen.convertY(ly);
    return { x: sx, y: sy };
  }

  public getScreenSizeFromCode(
    converters: Converters,
    codeSize: CodeSize<TCodeX, TCodeY>
  ): ScreenSize {
    const lx = converters.codeToLayout.convertX(codeSize.width);
    const ly = converters.codeToLayout.convertY(codeSize.height);
    const sx = converters.layoutToScreen.convertX(lx);
    const sy = converters.layoutToScreen.convertY(ly);
    return { width: sx, height: sy };
  }

  public getLayoutPosition(
    converters: Converters,
    screenPosition: ScreenPosition
  ): LayoutPosition {
    return {
      x: converters.screenToLayout.convertX(screenPosition.x),
      y: converters.screenToLayout.convertY(screenPosition.y),
    };
  }

  getCodePosition(
    converters: Converters,
    layoutPos: LayoutPosition
  ): CodePosition<TCodeX, TCodeY> {
    return {
      x: converters.layoutToCode.convertX(layoutPos.x),
      y: converters.layoutToCode.convertY(layoutPos.y),
    };
  }

  getCodePositionFromScreen(
    converters: Converters,
    spos: ScreenPosition
  ): CodePosition<TCodeX, TCodeY> {
    const layoutPos = this.getLayoutPosition(converters, spos);
    return {
      x: converters.layoutToCode.convertX(layoutPos.x),
      y: converters.layoutToCode.convertY(layoutPos.y),
    };
  }
}
