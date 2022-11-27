import { FakePart } from './tests/FakePart';
import { GuiPartsCollection } from './GuiPartsCollection';

describe('General', () => {
  it('Collection count and contains check', () => {
    const parts = new GuiPartsCollection();
    const fakePartA = new FakePart();
    const fakePartB = new FakePart();

    parts.push(fakePartA);
    parts.push(fakePartB);

    expect(parts).toHaveLength(2);
    expect(parts).toContain(fakePartA);
    expect(parts).toContain(fakePartB);
  });
});
