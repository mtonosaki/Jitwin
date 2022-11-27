import { GuiPart } from './GuiPart';
import {
  ConverterCodeToLayout,
  ConverterLayoutToScreen,
  LayoutX,
  LayoutY,
  ScreenX,
  ScreenY,
} from './ThreeCoordinatesSystem';

function passThrowLayoutToScreenX(value: LayoutX): ScreenX {
  return { screen: value.layout };
}

function passThrowLayoutToScreenY(value: LayoutY): ScreenY {
  return { screen: value.layout };
}

export class GuiPartsCollection extends Array<GuiPart> {
  codeToLayout: ConverterCodeToLayout = {
    convertX: (value) => value,
    convertY: (value) => value,
  };

  layoutToScreen: ConverterLayoutToScreen = {
    convertX: passThrowLayoutToScreenX,
    convertY: passThrowLayoutToScreenY,
  };
}

export type GuiPartsLayerCollection = Map<number, GuiPartsCollection>;
