import { GuiFeature } from '../GuiFeature';
import { GuiPart } from '../GuiPart';

export default class FakeFeature extends GuiFeature {
  public mockParts: GuiPart[];

  constructor(parts: GuiPart[]) {
    super();
    this.mockParts = parts;
  }

  override beforeRun() {
    super.beforeRun();
    this.mockParts.forEach((part) => {
      this.parts.push(part);
    });
  }
}
