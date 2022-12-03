import {
  CodePosition,
  CodeSize,
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
  LayoutPosition,
  ScreenPosition,
} from './ThreeCoordinatesSystem';
import { GuiUndefinedException } from './GuiExeption';

export interface GuiPartPosition<TX, TY> {
  codePosition?: CodePosition<TX, TY>;
  codeSize?: CodeSize<TX, TY>;
}

export type Converters = {
  codeToLayout: ConverterCodeToLayout;
  layoutToScreen: ConverterLayoutToScreen;
  screenToLayout: ConverterScreenToLayout;
  layoutToCode: ConverterLayoutToCode;
};

export type DrawProps = {
  g: CanvasRenderingContext2D;
  converters: Converters;
};

export interface GuiPart {
  testId: string | undefined;

  draw(dp: DrawProps): void;

  getScreenPosition(converters: Converters): ScreenPosition;

  peekCodePositionAsAny(): CodePosition<any, any>;
}

export abstract class GuiPartBase<TX, TY>
  implements GuiPart, GuiPartPosition<TX, TY>
{
  public testId: string | undefined;

  public codePosition?: CodePosition<TX, TY>;

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

    const lx = converters.codeToLayout.convertX(this.codePosition.x);
    const ly = converters.codeToLayout.convertY(this.codePosition.y);
    const sx = converters.layoutToScreen.convertX(lx);
    const sy = converters.layoutToScreen.convertY(ly);
    return { x: sx, y: sy };
  }

  protected getLayoutPosition(
    converters: Converters,
    spos: ScreenPosition
  ): LayoutPosition {
    return {
      x: converters.screenToLayout.convertX(spos.x),
      y: converters.screenToLayout.convertY(spos.y),
    };
  }

  getCodePosition(
    converters: Converters,
    layoutPos: LayoutPosition
  ): CodePosition<TX, TY> {
    return {
      x: converters.layoutToCode.convertX(layoutPos.x),
      y: converters.layoutToCode.convertY(layoutPos.y),
    };
  }

  getCodePositionFromScreen(
    converters: Converters,
    spos: ScreenPosition
  ): CodePosition<TX, TY> {
    const layoutPos = this.getLayoutPosition(converters, spos);
    return {
      x: converters.layoutToCode.convertX(layoutPos.x),
      y: converters.layoutToCode.convertY(layoutPos.y),
    };
  }
}
