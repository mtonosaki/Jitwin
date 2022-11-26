import { GuiPartsCollection } from './GuiPartsCollection';
import { makeNewUuid } from './utils/uuid';

export class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  protected parts: GuiPartsCollection = [];

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
