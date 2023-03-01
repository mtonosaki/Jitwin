import { GuiPart } from 'mvfp/GuiPart'
import { Converters } from 'mvfp/GuiTypes'
import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ConverterLayoutToScreen,
  ConverterScreenToLayout,
  PaneState,
} from './ThreeCoordinatesSystem'

export type PartAndPane = {
  part: GuiPart
  pane: PaneState
}

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
    }
  }

  codeToLayout: ConverterCodeToLayout = {
    convertX(codeValue) {
      return { layout: 0 } // dummy
    },
    convertY(codeValue) {
      return { layout: 0 } // dummy
    },
  }

  layoutToCode: ConverterLayoutToCode = {
    // dummy
    convertX: (value) => undefined, // return type is CodeX<T>
    convertY: (value) => undefined, // return type is CodeY<T>
  }

  readonly layoutToScreen: ConverterLayoutToScreen = {
    convertX(value, pane, considerOffset) {
      return {
        screen:
          value.layout / LPSX +
          (considerOffset
            ? pane.scroll.x.screen + pane.paneTopLeft.x.screen
            : 0),
      }
    },
    convertY(value, pane, considerScroll) {
      return {
        screen:
          value.layout / LPSY +
          (considerScroll
            ? pane.scroll.y.screen + pane.paneTopLeft.y.screen
            : 0),
      }
    },
  }

  readonly screenToLayout: ConverterScreenToLayout = {
    convertX(value, pane, considerOffset) {
      return {
        layout:
          (value.screen -
            (considerOffset
              ? pane.scroll.x.screen + pane.paneTopLeft.x.screen
              : 0)) *
          LPSX,
      }
    },
    convertY(value, pane, considerScroll) {
      return {
        layout:
          (value.screen -
            (considerScroll
              ? pane.scroll.y.screen + pane.paneTopLeft.y.screen
              : 0)) *
          LPSY,
      }
    },
  }
}

export type GuiPartsLayerCollection = Map<number, GuiPartsCollection>
export const LPSX: number = 2.0 // Layout logical pixels Per Screen display pixel
export const LPSY: number = 2.0 // Layout logical pixels Per Screen display pixel
