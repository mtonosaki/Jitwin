import { CodeSize } from 'mvfp/ThreeCoordinatesSystem';
import { DrawProps } from 'mvfp/GuiTypes';
import { GuiPartBase } from 'mvfp/GuiPart';
import { UnitDistance } from '../SimulationUnit';

export class PartProcess extends GuiPartBase<UnitDistance, UnitDistance> {
  public codeSize: CodeSize<UnitDistance, UnitDistance>;

  constructor() {
    super();

    this.codeSize = {
      width: { code: { m: 1 } },
      height: { code: { m: 1 } },
    };
  }

  override draw(dp: DrawProps) {
    const position = this.getScreenPosition(dp.converters);
    const size = this.getScreenSizeFromCode(dp.converters, this.codeSize);

    dp.g.strokeStyle = 'rgb(64, 64, 48, 0.1)';
    dp.g.strokeRect(
      position.x.screen - size.width.screen / 2,
      position.y.screen - size.height.screen / 2,
      size.width.screen,
      size.height.screen
    );
  }
}
