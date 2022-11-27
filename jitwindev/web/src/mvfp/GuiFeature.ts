import { GuiPartsLayerCollection } from './GuiPartsCollection';
import { makeNewUuid } from './utils/uuid';

export class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  // A shared layer collection automatically set by the GuiView.
  // Do not use this instance except for testing.
  protected partsLayers: GuiPartsLayerCollection = new Map();

  constructor(id?: string) {
    this.id = id || makeNewUuid();
  }

  beforeRun(): void {}

  run(): void {}

  getName(): string {
    return this.constructor.name;
  }

  toString(): string {
    return `${this.getName()} id=${this.id} ${
      this.enabled ? 'enabled' : 'disabled'
    }`;
  }
}
