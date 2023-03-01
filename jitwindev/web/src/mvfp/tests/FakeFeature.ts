import { FakePart } from 'mvfp/tests/FakePart'
import {
  ConverterCodeToLayout,
  ConverterLayoutToCode,
  ScreenPosition,
  ScreenX,
  ScreenY,
} from 'mvfp/ThreeCoordinatesSystem'
import { GuiFeature } from '../GuiFeature'
import { GuiPart } from '../GuiPart'
import { GuiPartsCollection } from '../GuiPartsCollection'

export default class FakeFeature extends GuiFeature {
  public mockParts: GuiPart[]

  constructor(parts: GuiPart[]) {
    super()
    this.mockParts = parts
  }

  override beforeRun() {
    if (!this.partsLayers.has(0)) {
      this.partsLayers.set(0, new GuiPartsCollection())
    }
    this.mockParts.forEach((part) => {
      this.partsLayers.get(0)?.push({ part, pane: this.pane })
    })
  }
}

export class FakeScreenPositionFeature extends GuiFeature {
  static partTestId = 'TEST-SCREEN-POSITION-PART'

  initialPosition: ScreenPosition

  constructor(pos: ScreenPosition = { x: { screen: 0 }, y: { screen: 0 } }) {
    super()
    this.initialPosition = pos
  }

  beforeRun() {
    super.beforeRun()
    const part = new FakePart()
    part.testId = FakeScreenPositionFeature.partTestId
    const partsCollection = this.layer(0, () => {
      const layer = new GuiPartsCollection()
      layer.codeToLayout = passThroughCodeToLayout
      layer.layoutToCode = passThroughLayoutToCode
      return layer
    })
    partsCollection.push({ pane: this.targetPane, part })
    part.codePosition = {
      x: { code: this.initialPosition.x.screen },
      y: { code: this.initialPosition.y.screen },
    }
  }
}

const passThroughCodeToLayout: ConverterCodeToLayout = {
  convertX(value) {
    return { layout: value.code }
  },
  convertY(value) {
    return { layout: value.code }
  },
}

const passThroughLayoutToCode: ConverterLayoutToCode = {
  convertX(value) {
    return { code: value.layout }
  },
  convertY(value) {
    return { code: value.layout }
  },
}
