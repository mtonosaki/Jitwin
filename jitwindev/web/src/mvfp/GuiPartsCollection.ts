import { GuiPart } from 'mvfp/GuiPart';
import { Converters } from 'mvfp/GuiTypes';
import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
  PaneState,
} from './ThreeCoordinatesSystem';

export type PartAndPane = {
  part: GuiPart;
  pane: PaneState;
};

// USAGE: HOW TO CUSTOMIZE COORDINATE CONVERTERS
//
// guiPartsCollection.codeToLayout = {
//   convertX: myCodeToLayoutX,
//   convertY(value) {
//     return { layout: (value.code as number) * 2 };
//   },
// };
// guiPartsCollection.layoutToScreen = {
//   convertX(value) {
//     return { screen: value.layout * 100 };
//   },
//   convertY(value) {
//     return { screen: value.layout * 100 };
//   },
// };
// function myCodeToLayoutX(value: any): LayoutX {
//   switch (value.code) {
//     case 'one':
//       return { layout: 1 };
//     default:
//       return { layout: 0 };
//   }
// }
export class GuiPartsCollection extends Array<PartAndPane> {
  getConverters(): Converters {
    return {
      codeToLayout: this.codeToLayout,
      layoutToScreen: this.layoutToScreen,
      screenToLayout: this.screenToLayout,
      layoutToCode: this.layoutToCode,
    };
  }

  codeToLayout: ConverterCodeToLayout = {
    convertX(codeValue) {
      return { layout: 0 }; // dummy
    },
    convertY(codeValue) {
      return { layout: 0 }; // dummy
    },
  };

  layoutToScreen: ConverterLayoutToScreen = {
    convertX(value, pane) {
      return { screen: value.layout / LPS + pane.scroll.x.screen };
    },
    convertY(value, pane) {
      return { screen: value.layout / LPS + pane.scroll.y.screen };
    },
  };

  screenToLayout: ConverterScreenToLayout = {
    convertX(value, pane) {
      return { layout: (value.screen - pane.scroll.x.screen) * LPS };
    },
    convertY(value, pane) {
      return { layout: (value.screen - pane.scroll.y.screen) * LPS };
    },
  };

  layoutToCode: ConverterLayoutToCode = {
    // dummy
    convertX: (value) => undefined, // return type is CodeX<T>
    convertY: (value) => undefined, // return type is CodeY<T>
  };
}

export type GuiPartsLayerCollection = Map<number, GuiPartsCollection>;
export const LPS: number = 16.0; // Layout pixels Per Screen
