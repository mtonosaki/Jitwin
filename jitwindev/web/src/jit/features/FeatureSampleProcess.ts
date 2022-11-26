import { GuiFeature } from 'mvfp/GuiFeature';

export class FeatureSampleProcess extends GuiFeature {
  override beforeRun() {
    super.beforeRun();

    this.parts.push();
  }
}
