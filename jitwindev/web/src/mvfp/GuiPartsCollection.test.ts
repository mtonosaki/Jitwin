import { GuiPartsCollectionImpl } from './GuiPartsCollection';
import { FakePart } from './tests/FakePart';

describe('General', () => {
  it('Collection count and contains check', () => {
    const parts = new GuiPartsCollectionImpl();
    const fakePartA = new FakePart();
    const fakePartB = new FakePart();

    parts.add(fakePartA);
    parts.add(fakePartB);

    expect(parts.getCount()).toBe(2);
    expect(parts.contains(fakePartA)).toBeTruthy();
    expect(parts.contains(fakePartB)).toBeTruthy();
  });
});
