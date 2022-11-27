import { GuiPart } from './GuiPart';
import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
} from './ThreeCoordinatesSystem';

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
export class GuiPartsCollection extends Array<GuiPart> {
  codeToLayout: ConverterCodeToLayout = {
    convertX(codeValue) {
      return { layout: 0 };
    },
    convertY(codeValue) {
      return { layout: 0 };
    },
  };

  layoutToScreen: ConverterLayoutToScreen = {
    convertX(value) {
      return { screen: 0 };
    },
    convertY(value) {
      return { screen: 0 };
    },
  };

  screenToLayout: ConverterScreenToLayout = {
    convertX(value) {
      return { layout: 0 };
    },
    convertY(value) {
      return { layout: 0 };
    },
  };

  layoutToCode: ConverterLayoutToCode = {
    convertX: (value) => undefined, // return type is CodeX<T>
    convertY: (value) => undefined, // return type is CodeY<T>
  };
}

export type GuiPartsLayerCollection = Map<number, GuiPartsCollection>;
