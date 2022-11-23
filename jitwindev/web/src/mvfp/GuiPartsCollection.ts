import { GuiPart } from './GuiPart';

export interface GuiPartsCollection {
  add: (part: GuiPart) => void;
  getCount: () => number;
  contains: (part: GuiPart) => boolean;
}

export class GuiPartsCollectionImpl implements GuiPartsCollection {
  private partsCollection: GuiPart[] = [];

  add(part: GuiPart): void {
    this.partsCollection.push(part);
  }

  getCount(): number {
    return this.partsCollection.length;
  }

  contains(part: GuiPart): boolean {
    return this.partsCollection.filter((it) => it === part).length > 0;
  }
}

export const dummyPartsCollection = new GuiPartsCollectionImpl();
