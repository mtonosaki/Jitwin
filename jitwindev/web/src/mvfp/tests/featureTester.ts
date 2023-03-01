import { GuiFeature } from 'mvfp/GuiFeature'
import { GuiPartsCollection } from 'mvfp/GuiPartsCollection'
import { CallbackAddLog, LogRecord } from 'mvfp/utils/LogSystem'

export class FeatureTester extends GuiFeature {
  override layer(
    layerNo: number,
    defaultInstanciater?: () => GuiPartsCollection
  ): GuiPartsCollection {
    return super.layer(layerNo, defaultInstanciater)
  }

  setAddLogCallback(callback: CallbackAddLog): void {
    ;(this as any).addLog = callback
  }
}

export function makeFeatureTester(feature: GuiFeature): FeatureTester {
  ;(feature as any).addLog = (log: LogRecord): void => {
    // DO NOTHING FOR TESTING
  }
  ;(feature as any).setAddLogCallback =
    FeatureTester.prototype.setAddLogCallback

  return feature as FeatureTester
}
