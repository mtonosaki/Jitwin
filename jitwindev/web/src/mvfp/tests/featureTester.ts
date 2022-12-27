import { GuiFeature } from 'mvfp/GuiFeature'
import { GuiPartsLayerCollection } from 'mvfp/GuiPartsCollection'

export class FeatureTester extends GuiFeature {
}

export function makeFeatureTester(feature: GuiFeature): FeatureTester {
  return feature;
}