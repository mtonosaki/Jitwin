import { PaneState } from 'mvfp/ThreeCoordinatesSystem';
import { GuiPartsCollection } from './GuiPartsCollection';
import { FakePart } from './tests/FakePart';

describe('General', () => {
  it('Collection count and contains check', () => {
    const parts = new GuiPartsCollection();
    const fakePartA = new FakePart();
    const fakePartB = new FakePart();
    const fakePaneA: PaneState = {
      name: 'fakePaneA',
      scroll: { x: { screen: 11 }, y: { screen: 22 } },
    };
    const fakePaneB: PaneState = {
      name: 'fakePaneB',
      scroll: { x: { screen: 33 }, y: { screen: 44 } },
    };

    parts.push({ part: fakePartA, pane: fakePaneA });
    parts.push({ part: fakePartB, pane: fakePaneB });

    expect(parts).toHaveLength(2);
    expect(parts.map((it) => it.part)).toContain(fakePartA);
    expect(parts.map((it) => it.part)).toContain(fakePartB);
    expect(parts.map((it) => it.pane)).toContain(fakePaneA);
    expect(parts.map((it) => it.pane)).toContain(fakePaneB);
  });
});
