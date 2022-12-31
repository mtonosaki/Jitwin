import { Converters, DrawProps, Positioner } from 'mvfp/GuiTypes';
import { GuiUndefinedException } from './GuiExeption';
import {
  CodePosition,
  CodeSize,
  LayoutPosition,
  LayoutSize,
  ScreenPosition,
  ScreenSize,
} from './ThreeCoordinatesSystem';

export interface GuiPartPosition<TCodeX, TCodeY> {
  codePosition?: CodePosition<TCodeX, TCodeY>;
  codeSize?: CodeSize<TCodeX, TCodeY>;
}

export interface GuiPart {
  testId: string | undefined;

  draw(dp: DrawProps): void;

  getScreenPosition(positioner: Positioner): ScreenPosition;

  getLayoutPosition(
    positioner: Positioner,
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

  public getScreenPosition(positioner: Positioner): ScreenPosition {
    if (!this.codePosition)
      throw new GuiUndefinedException('GuiParts.getScreenPosition');

    return this.getScreenPositionFromCode(positioner, this.codePosition);
  }

  public getScreenPositionFromCode(
    positioner: Positioner,
    codePosition: CodePosition<TCodeX, TCodeY>
  ): ScreenPosition {
    const lx = positioner.converters.codeToLayout.convertX(codePosition.x);
    const ly = positioner.converters.codeToLayout.convertY(codePosition.y);
    const sx = positioner.converters.layoutToScreen.convertX(
      lx,
      positioner.pane,
      true
    );
    const sy = positioner.converters.layoutToScreen.convertY(
      ly,
      positioner.pane,
      true
    );
    return { x: sx, y: sy };
  }

  public getScreenSizeFromCode(
    positioner: Positioner,
    codeSize: CodeSize<TCodeX, TCodeY>
  ): ScreenSize {
    const lx = positioner.converters.codeToLayout.convertX(codeSize.width);
    const ly = positioner.converters.codeToLayout.convertY(codeSize.height);
    const sx = positioner.converters.layoutToScreen.convertX(
      lx,
      positioner.pane,
      false
    );
    const sy = positioner.converters.layoutToScreen.convertY(
      ly,
      positioner.pane,
      false
    );
    return { width: sx, height: sy };
  }

  public getLayoutPosition(
    positioner: Positioner,
    screenPosition: ScreenPosition
  ): LayoutPosition {
    return {
      x: positioner.converters.screenToLayout.convertX(
        screenPosition.x,
        positioner.pane,
        true
      ),
      y: positioner.converters.screenToLayout.convertY(
        screenPosition.y,
        positioner.pane,
        true
      ),
    };
  }

  public getLayoutSize(
    positioner: Positioner,
    screenSize: ScreenSize
  ): LayoutSize {
    return {
      width: positioner.converters.screenToLayout.convertX(
        screenSize.width,
        positioner.pane,
        false
      ),
      height: positioner.converters.screenToLayout.convertY(
        screenSize.width,
        positioner.pane,
        false
      ),
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
    positioner: Positioner,
    spos: ScreenPosition
  ): CodePosition<TCodeX, TCodeY> {
    const layoutPos = this.getLayoutPosition(positioner, spos);
    return {
      x: positioner.converters.layoutToCode.convertX(layoutPos.x),
      y: positioner.converters.layoutToCode.convertY(layoutPos.y),
    };
  }
}
