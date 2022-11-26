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

export type LayoutSize = {
  width: LayoutX;
  height: LayoutY;
};

export type LayoutRectangle = {
  position: LayoutPosition;
  size: LayoutSize;
};

export type ScreenPosition = {
  x: ScreenX;
  y: ScreenY;
};

export type ScreenSize = {
  width: ScreenX;
  height: ScreenY;
};

export type ScreenRectangle = {
  position: ScreenPosition;
  size: ScreenSize;
};
