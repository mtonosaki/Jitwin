import { GuiFeature } from 'mvfp/GuiFeature';
import { GuiPartsCollection } from 'mvfp/GuiPartsCollection';

export class FeatureTester extends GuiFeature {
  override layer(
    layerNo: number,
    defaultInstanciater?: () => GuiPartsCollection
  ): GuiPartsCollection {
    return super.layer(layerNo, defaultInstanciater);
  }
}

export function makeFeatureTester(feature: GuiFeature): FeatureTester {
  return feature as FeatureTester;
}
