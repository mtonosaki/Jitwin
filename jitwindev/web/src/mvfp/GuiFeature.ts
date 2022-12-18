import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from './GuiPartsCollection';
import { makeNewUuid } from './utils/uuid';
import { Pane } from './GuiPane';

export abstract class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  // A shared layer collection automatically set by the GuiView.
  // Do not use this instance except for testing.
  protected partsLayers: GuiPartsLayerCollection = new Map();

  protected targetPane: Pane | undefined;

  constructor(id?: string) {
    this.id = id || makeNewUuid();
  }

  protected layer(
    layerNo: number,
    defaultInstanciater?: () => GuiPartsCollection
  ) {
    const parts = this.partsLayers.get(layerNo);
    if (parts) {
      return parts;
    }
    if (!parts && defaultInstanciater) {
      const newParts = defaultInstanciater();
      this.partsLayers.set(layerNo, newParts);
      return newParts;
    }
    return undefined;
  }

  public beforeRun(): void {}

  public run(): void {}

  public getName(): string {
    return this.constructor.name;
  }

  public getTargetPane(): Pane | undefined {
    return this.targetPane;
  }

  public toString(): string {
    return `${this.getName()} id=${this.id} ${
      this.enabled ? 'enabled' : 'disabled'
    }`;
  }
}
