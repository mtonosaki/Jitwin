import { GuiPartBase } from 'mvfp/GuiPart'
import { DrawProps } from 'mvfp/GuiTypes'
import { CodeSize } from 'mvfp/ThreeCoordinatesSystem'
import { UnitDistance } from '../SimulationUnit'

export class PartProcess extends GuiPartBase<UnitDistance, UnitDistance> {
  public codeSize: CodeSize<UnitDistance, UnitDistance>

  constructor() {
    super()

    this.codeSize = {
      width: { code: { m: 1 } },
      height: { code: { m: 1 } },
    }
  }

  override draw(dp: DrawProps) {
    const position = this.getScreenPosition(dp)
    const size = this.getScreenSizeFromCode(dp, this.codeSize)

    dp.g.strokeStyle = 'rgb(64, 64, 48, 0.1)'
    dp.g.strokeRect(
      position.x.screen - size.width.screen / 2,
      position.y.screen - size.height.screen / 2,
      size.width.screen,
      size.height.screen
    )
  }
}
