import { GuiPart } from 'mvfp/GuiPart';
import { Converters } from 'mvfp/GuiTypes';
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
    convertX(value) {
      return { screen: 0 }; // dummy
    },
    convertY(value) {
      return { screen: 0 }; // dummy
    },
  };

  screenToLayout: ConverterScreenToLayout = {
    convertX(value) {
      return { layout: 0 }; // dummy
    },
    convertY(value) {
      return { layout: 0 }; // dummy
    },
  };

  layoutToCode: ConverterLayoutToCode = {
    // dummy
    convertX: (value) => undefined, // return type is CodeX<T>
    convertY: (value) => undefined, // return type is CodeY<T>
  };
}

export type GuiPartsLayerCollection = Map<number, GuiPartsCollection>;
