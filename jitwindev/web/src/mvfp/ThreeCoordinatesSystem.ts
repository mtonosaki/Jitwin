export type CodeX<TCodeX> = {
  code: TCodeX
}

export type CodeY<TCodeY> = {
  code: TCodeY
}

export type LayoutX = {
  layout: number
}

export type LayoutY = {
  layout: number
}

export type ScreenX = {
  screen: number
}

export type ScreenY = {
  screen: number
}

export type CodePosition<TCodeX, TCodeY> = {
  x: CodeX<TCodeX>
  y: CodeY<TCodeY>
}

export type CodeSize<TCodeX, TCodeY> = {
  width: CodeX<TCodeX>
  height: CodeY<TCodeY>
}

export type CodeRectangle<TCodeX, TCodeY> = {
  position: CodePosition<TCodeX, TCodeY>
  size: CodeSize<TCodeX, TCodeY>
}

export type LayoutPosition = {
  x: LayoutX
  y: LayoutY
}

export const layoutPosition0: LayoutPosition = {
  x: { layout: 0 },
  y: { layout: 0 },
}

export type LayoutSize = {
  width: LayoutX
  height: LayoutY
}

export const layoutSize0: LayoutSize = {
  width: { layout: 0 },
  height: { layout: 0 },
}

export type LayoutRectangle = {
  position: LayoutPosition
  size: LayoutSize
}

export const layoutRectangle0: LayoutRectangle = {
  position: layoutPosition0,
  size: layoutSize0,
}

export type ScreenPosition = {
  x: ScreenX
  y: ScreenY
}

export const screenPosition0: ScreenPosition = {
  x: { screen: 0 },
  y: { screen: 0 },
}

export type ScreenSize = {
  width: ScreenX
  height: ScreenY
}

export const screenSize0: ScreenSize = {
  width: { screen: 0 },
  height: { screen: 0 },
}

export type ScreenRectangle = {
  position: ScreenPosition
  size: ScreenSize
}

export const screenRectangle0 = {
  position: screenPosition0,
  size: screenSize0,
}

export type ConverterCodeToLayout = {
  convertX: (codeValueX: any /* CodeX */) => LayoutX
  convertY: (codeValueY: any /* CodeY */) => LayoutY
}

export type ConverterLayoutToScreen = {
  convertX: (
    value: LayoutX,
    pane: PaneState,
    considerScroll: boolean
  ) => ScreenX
  convertY: (
    value: LayoutY,
    pane: PaneState,
    considerScroll: boolean
  ) => ScreenY
}

export type ConverterScreenToLayout = {
  convertX: (
    value: ScreenX,
    pane: PaneState,
    considerOffset: boolean
  ) => LayoutX
  convertY: (
    value: ScreenY,
    pane: PaneState,
    considerOffset: boolean
  ) => LayoutY
}

export type ConverterLayoutToCode = {
  convertX: (value: LayoutX) => any // any is CodeX<TCodeX>
  convertY: (value: LayoutY) => any // any is CodeY<TCodeY>
}

export type PaneState = {
  name: string
  scroll: ScreenPosition
  paneTopLeft: ScreenPosition
  paneSize: ScreenSize
}
