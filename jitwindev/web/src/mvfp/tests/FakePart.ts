import { DrawProps, GuiPartBase } from '../GuiPart';

export class FakePart extends GuiPartBase<number, number> {
  draw({ g }: DrawProps): void {}
}
