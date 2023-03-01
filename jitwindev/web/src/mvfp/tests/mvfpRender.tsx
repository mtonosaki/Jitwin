import { GuiEvents } from 'mvfp/tests/GuiEvents'
import { view } from 'mvfp/tests/View'
import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, RenderResult } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { toBeInTheView, toHaveBeenDrawnAt } from './MvfpToBeXxx'
import { FEATURE_EXECUTION_SPAN_MSEC } from '../MvfpParameters'

expect.extend({
  toBeInTheView,
  toHaveBeenDrawnAt,
})

export const mvfpRender = (ui: React.ReactElement): RenderResult => {
  const utils = render(<RecoilRoot>{ui}</RecoilRoot>)
  view.features = (global as any).mvfpViewParameter.features
  view.partsLayers = (global as any).mvfpViewParameter.partsLayers
  view.refDrawnParts = (global as any).mvfpViewParameter.refDrawnParts
  view.refDefaultPane = (global as any).mvfpViewParameter.refDefaultPane
  return utils
}

export type TestInitResult = {
  stubCanvas: jest.Mock
  spyStrokeRect: jest.Mock
  spyClearRect: jest.Mock
}

export function testInitFeatureCycle(): TestInitResult {
  const spyStrokeRect = jest.fn()
  const spyClearRect = jest.fn()
  const stubCanvas = jest.fn()

  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    translate: jest.fn(),
    clearRect: spyClearRect,
    strokeRect: spyStrokeRect,
    canvas: stubCanvas,
  } as any)

  jest.useFakeTimers()

  return { spyStrokeRect, spyClearRect, stubCanvas }
}

export const testNextCycleAsync = async () =>
  act(async () => {
    jest.advanceTimersByTime(FEATURE_EXECUTION_SPAN_MSEC)
  })
