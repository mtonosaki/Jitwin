import { ScreenPosition } from 'mvfp/ThreeCoordinatesSystem'

export type GuiEvents = {
  eventName: string
}

export function clickMouseRight(pos: ScreenPosition): GuiEvents[] {
  return [holdMouseRight(pos), releaseMouseRight()]
}

export function holdMouseRight(pos: ScreenPosition): GuiEvents {
  return { eventName: 'holdMouseRight' }
}

export function moveMouseTo(pos: ScreenPosition): GuiEvents {
  return { eventName: 'moveMouseTo' }
}

export function releaseMouseRight(): GuiEvents {
  return { eventName: 'releaseMouseRight' }
}
