import { GuiFeature } from '../GuiFeature';
import { GuiPart } from '../GuiPart';
import { GuiPartsCollection } from '../GuiPartsCollection';

export default class FakeFeature extends GuiFeature {
  public mockParts: GuiPart[];

  constructor(parts: GuiPart[]) {
    super();
    this.mockParts = parts;
  }

  override beforeRun() {
    if (!this.partsLayers.has(0)) {
      this.partsLayers.set(0, new GuiPartsCollection());
    }
    this.mockParts.forEach((part) => {
      this.partsLayers.get(0)?.push({ part, pane: this.pane });
    });
  }
}
