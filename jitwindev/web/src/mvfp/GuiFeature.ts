import { randomUUID } from 'crypto';

export default class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  constructor(id?: string) {
    this.id = id || randomUUID();
  }

  beforeRun(): void {
    // eslint-disable-next-line no-console
    console.log(`dummy beforeRun called of ${this.toString()}`);
  }

  run(): void {
    // eslint-disable-next-line no-console
    console.log(`dummy run called of ${this.toString()}`);
  }

  getName(): string {
    return this.constructor.name;
  }

  toString(): string {
    return `${this.getName()} id=${this.id} ${
      this.enabled ? 'enabled' : 'disabled'
    }`;
  }
}
