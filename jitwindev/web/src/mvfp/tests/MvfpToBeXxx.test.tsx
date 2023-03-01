import { fakePaneState } from 'mvfp/tests/Fakes'
import React from 'react'
import { DrawProps } from 'mvfp/GuiTypes'
import { FakePart } from './FakePart'
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
  LPSX,
  LPSY,
} from '../GuiPartsCollection'
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from './mvfpRender'
import GuiView from '../GuiView'
import { view } from './View'
import { GuiPartBase } from '../GuiPart'

describe('Custom test methods', () => {
  it('.toBeInTheView()', () => {
    const part = new FakePart()
    part.testId = 'test-part-id'
    const layers: GuiPartsLayerCollection = new Map()
    layers.set(0, new GuiPartsCollection())
    layers.get(0)!.push({ part, pane: fakePaneState })
    mvfpRender(<GuiView partsLayers={layers} />)
    expect(view.getPartByTestId('test-part-id')).toBeInTheView()
  })

  it('.not.toBeInTheView()', () => {
    const part = new FakePart()
    part.testId = 'not-hit-test-part-id'
    const layers: GuiPartsLayerCollection = new Map()
    layers.set(0, new GuiPartsCollection())
    layers.get(0)!.push({ part, pane: fakePaneState })
    mvfpRender(<GuiView partsLayers={layers} />)
    expect(view.queryPartByTestId('test-part-id')).not.toBeInTheView()
  })

  it('.toHaveBeenDrawnAt {three-coordinate}', async () => {
    // GIVEN
    type TestCodeX = { hoge: { fuga: string } }

    class MockPositionPart extends GuiPartBase<number, TestCodeX> {
      constructor() {
        super()
        this.testId = 'i-am-a-test-part'
        this.codePosition = {
          x: { code: 10 },
          y: { code: { hoge: { fuga: 'piyo' } } },
        }
      }

      draw(dp: DrawProps): void {
        expect(dp.converters).not.toBeNull()
      }
    }

    const layers: GuiPartsLayerCollection = new Map()
    const layer = new GuiPartsCollection()
    layers.set(0, layer)
    const part = new MockPositionPart()
    layers.get(0)!.push({ part, pane: fakePaneState })

    layer.codeToLayout = {
      convertX(value) {
        return { layout: (value.code as number) * 2 }
      },
      convertY(value) {
        switch ((value.code as TestCodeX).hoge.fuga) {
          case 'piyo':
            return { layout: 100 }
        }
        return { layout: 0 }
      },
    }
    layer.layoutToCode = {
      convertX(value) {
        return { code: value.layout / 2 }
      },
      convertY(value) {
        switch (value.layout) {
          case 100:
            return { code: { hoge: { fuga: 'piyo' } } }
        }
        return { code: { hoge: { fuga: 'bar' } } }
      },
    }

    // WHEN
    testInitFeatureCycle()
    mvfpRender(<GuiView partsLayers={layers} />)
    await testNextCycleAsync()

    // THEN
    const testPart = view.getPartByTestId('i-am-a-test-part')
    expect(testPart).toHaveBeenDrawnAt({
      x: { code: 10 },
      y: { code: { hoge: { fuga: 'piyo' } } },
    })
    expect(testPart).toHaveBeenDrawnAt({
      x: { layout: 20 },
      y: { layout: 100 },
    })
    expect(testPart).toHaveBeenDrawnAt({
      x: { screen: 20 / LPSX },
      y: { screen: 100 / LPSY },
    })
  })
})
