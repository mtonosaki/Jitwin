import {
  PaneState,
  screenPosition0,
  screenSize0,
} from 'mvfp/ThreeCoordinatesSystem';
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
      paneTopLeft: screenPosition0,
      paneSize: screenSize0,
    };
    const fakePaneB: PaneState = {
      name: 'fakePaneB',
      scroll: { x: { screen: 33 }, y: { screen: 44 } },
      paneTopLeft: screenPosition0,
      paneSize: screenSize0,
    };

    parts.push({ part: fakePartA, pane: fakePaneA });
    parts.push({ part: fakePartB, pane: fakePaneB });

    expect(parts).toHaveLength(2);
    expect(parts.map((it) => it.part)).toContain(fakePartA);
    expect(parts.map((it) => it.part)).toContain(fakePartB);
    expect(parts.map((it) => it.pane)).toContain(fakePaneA);
    expect(parts.map((it) => it.pane)).toContain(fakePaneB);
  });
  it('Have converter code to layout', () => {
    const collection = new GuiPartsCollection();
    const converter = collection.codeToLayout;

    expect(converter.convertX({})).toEqual({ layout: 0 });
    expect(converter.convertY({})).toEqual({ layout: 0 });
  });

  it('Have converter layout to code', () => {
    const collection = new GuiPartsCollection();
    const converter = collection.layoutToCode;

    expect(converter.convertX({ layout: 0 })).toBeUndefined();
    expect(converter.convertX({ layout: 1 })).toBeUndefined();
    expect(converter.convertY({ layout: 0 })).toBeUndefined();
    expect(converter.convertY({ layout: 1 })).toBeUndefined();
  });

  it('Have converter layout to screen', () => {
    const collection = new GuiPartsCollection();
    const it = collection.layoutToScreen;
    const pane: PaneState = {
      name: 'fake',
      scroll: { x: { screen: 20 }, y: { screen: 30 } },
      paneTopLeft: { x: { screen: 48 }, y: { screen: 32 } },
      paneSize: { width: { screen: 160 }, height: { screen: 320 } },
    };

    expect(it.convertX({ layout: 0 }, pane, false)).toEqual({ screen: 0 });
    expect(it.convertX({ layout: 0 }, pane, true)).toEqual({ screen: 68 });

    expect(it.convertX({ layout: 160 }, pane, false)).toEqual({ screen: 80 });
    expect(it.convertX({ layout: 160 }, pane, true)).toEqual({ screen: 148 });
    expect(it.convertY({ layout: 0 }, pane, false)).toEqual({ screen: 0 });
    expect(it.convertY({ layout: 0 }, pane, true)).toEqual({ screen: 62 });
    expect(it.convertY({ layout: 160 }, pane, false)).toEqual({ screen: 80 });
    expect(it.convertY({ layout: 160 }, pane, true)).toEqual({ screen: 142 });
  });

  it('Have converter screen to layout', () => {
    const collection = new GuiPartsCollection();
    const it = collection.screenToLayout;
    const pane: PaneState = {
      name: 'fake',
      scroll: { x: { screen: 20 }, y: { screen: 30 } },
      paneTopLeft: { x: { screen: 48 }, y: { screen: 32 } },
      paneSize: { width: { screen: 160 }, height: { screen: 320 } },
    };

    // 68 = 20 + 48
    // 160 = 320 / 2[LPSX] + 0 + 0
    // 228 = 320 / 2[LPSX] + 20 + 48
    expect(it.convertX({ screen: 0 }, pane, false)).toEqual({ layout: 0 });
    expect(it.convertX({ screen: 68 }, pane, true)).toEqual({ layout: 0 });
    expect(it.convertX({ screen: 160 }, pane, false)).toEqual({ layout: 320 });
    expect(it.convertX({ screen: 228 }, pane, true)).toEqual({ layout: 320 });

    // 62 = 30 + 32
    // 160 = 320 / 2[LPSY] + 0 + 0
    // 222 = 320 / 2[LPSY] + 30 + 32
    expect(it.convertY({ screen: 0 }, pane, false)).toEqual({ layout: 0 });
    expect(it.convertY({ screen: 62 }, pane, true)).toEqual({ layout: 0 });
    expect(it.convertY({ screen: 160 }, pane, false)).toEqual({ layout: 320 });
    expect(it.convertY({ screen: 222 }, pane, true)).toEqual({ layout: 320 });
  });
});
