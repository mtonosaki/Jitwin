export type CodeX<TX> = {
  code: TX;
};

export type CodeY<TY> = {
  code: TY;
};

export type LayoutX = {
  layout: number;
};

export type LayoutY = {
  layout: number;
};

export type ScreenX = {
  screen: number;
};

export type ScreenY = {
  screen: number;
};

export type CodePosition<TX, TY> = {
  x: CodeX<TX>;
  y: CodeY<TY>;
};

export type CodeSize<TX, TY> = {
  width: CodeX<TX>;
  height: CodeY<TY>;
};

export type CodeRectangle<TX, TY> = {
  position: CodePosition<TX, TY>;
  size: CodeSize<TX, TY>;
};

export type LayoutPosition = {
  x: LayoutX;
  y: LayoutY;
};

export const layoutPosition0: LayoutPosition = {
  x: { layout: 0 },
  y: { layout: 0 },
};

export type LayoutSize = {
  width: LayoutX;
  height: LayoutY;
};

export const layoutSize0: LayoutSize = {
  width: { layout: 0 },
  height: { layout: 0 },
};

export type LayoutRectangle = {
  position: LayoutPosition;
  size: LayoutSize;
};

export const layoutRectangle0: LayoutRectangle = {
  position: layoutPosition0,
  size: layoutSize0,
};

export type ScreenPosition = {
  x: ScreenX;
  y: ScreenY;
};

export const screenPosition0: ScreenPosition = {
  x: { screen: 0 },
  y: { screen: 0 },
};

export type ScreenSize = {
  width: ScreenX;
  height: ScreenY;
};

export const screenSize0: ScreenSize = {
  width: { screen: 0 },
  height: { screen: 0 },
};

export type ScreenRectangle = {
  position: ScreenPosition;
  size: ScreenSize;
};

export const screenRectangle0 = {
  position: screenPosition0,
  size: screenSize0,
};

export type ConverterCodeToLayout = {
  convertX: (codeValueX: any) => LayoutX;
  convertY: (codeValueY: any) => LayoutY;
};

export type ConverterLayoutToScreen = {
  convertX: (value: LayoutX) => ScreenX;
  convertY: (value: LayoutY) => ScreenY;
};

export type ConverterScreenToLayout = {
  convertX: (value: ScreenX) => LayoutX;
  convertY: (value: ScreenY) => LayoutY;
};

export type ConverterLayoutToCode = {
  convertX: (value: LayoutX) => any; // any is CodeX<T>
  convertY: (value: LayoutY) => any; // any is CodeY<T>
};
