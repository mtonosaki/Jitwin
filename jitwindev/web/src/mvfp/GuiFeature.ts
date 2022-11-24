import { randomUUID } from 'crypto';
import { dummyPartsCollection, GuiPartsCollection } from './GuiPartsCollection';

export class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  protected parts: GuiPartsCollection = dummyPartsCollection;

  constructor(id?: string) {
    this.id = id || randomUUID();
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
