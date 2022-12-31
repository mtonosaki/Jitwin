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
      paneSize: { width: { screen: 0 }, height: { screen: 0 } },
    };
    const fakePaneB: PaneState = {
      name: 'fakePaneB',
      scroll: { x: { screen: 33 }, y: { screen: 44 } },
      paneSize: { width: { screen: 0 }, height: { screen: 0 } },
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
      paneSize: { width: { screen: 160 }, height: { screen: 320 } },
    };

    expect(it.convertX({ layout: 0 }, pane, false)).toEqual({ screen: 0 });
    expect(it.convertX({ layout: 0 }, pane, true)).toEqual({ screen: 20 });
    expect(it.convertX({ layout: 160 }, pane, false)).toEqual({ screen: 80 });
    expect(it.convertX({ layout: 160 }, pane, true)).toEqual({ screen: 100 });
    expect(it.convertY({ layout: 0 }, pane, false)).toEqual({ screen: 0 });
    expect(it.convertY({ layout: 0 }, pane, true)).toEqual({ screen: 30 });
    expect(it.convertY({ layout: 160 }, pane, false)).toEqual({ screen: 80 });
    expect(it.convertY({ layout: 160 }, pane, true)).toEqual({ screen: 110 });
  });

  it('Have converter screen to layout', () => {
    const collection = new GuiPartsCollection();
    const it = collection.screenToLayout;
    const pane: PaneState = {
      name: 'fake',
      scroll: { x: { screen: 20 }, y: { screen: 30 } },
      paneSize: { width: { screen: 160 }, height: { screen: 320 } },
    };

    expect(it.convertX({ screen: 0 }, pane, false)).toEqual({ layout: 0 });
    expect(it.convertX({ screen: 20 }, pane, true)).toEqual({ layout: 0 });
    expect(it.convertX({ screen: 160 }, pane, false)).toEqual({ layout: 320 });
    expect(it.convertX({ screen: 180 }, pane, true)).toEqual({ layout: 320 });
    expect(it.convertY({ screen: 0 }, pane, false)).toEqual({ layout: 0 });
    expect(it.convertY({ screen: 30 }, pane, true)).toEqual({ layout: 0 });
    expect(it.convertY({ screen: 160 }, pane, false)).toEqual({ layout: 320 });
    expect(it.convertY({ screen: 190 }, pane, true)).toEqual({ layout: 320 });
  });
});
