import { ScreenPosition } from '../ThreeCoordinatesSystem'

export const screenOffset = (
  pos: ScreenPosition,
  x: number,
  y: number
): ScreenPosition => ({
  x: { screen: pos.x.screen + x },
  y: { screen: pos.y.screen + y },
})
