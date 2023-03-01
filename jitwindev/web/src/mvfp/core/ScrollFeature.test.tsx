import { ScrollFeature } from 'mvfp/core/ScrollFeature'
import GuiView from 'mvfp/GuiView'
import { FakeScreenPositionFeature } from 'mvfp/tests/FakeFeature'
import {
  clickMouseRight,
  holdMouseRight,
  moveMouseTo,
  releaseMouseRight,
} from 'mvfp/tests/GuiEvents'
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from 'mvfp/tests/mvfpRender'
import { view } from 'mvfp/tests/View'
import React from 'react'
import { Simulate } from 'react-dom/test-utils'

describe('ScrollFeature', () => {
  it('when mouse operation, scroll view', async () => {
    // GIVEN
    const partFeature = new FakeScreenPositionFeature({
      x: { screen: 0 },
      y: { screen: 0 },
    })
    const scrollFeature = new ScrollFeature()
    testInitFeatureCycle()
    mvfpRender(<GuiView features={[scrollFeature, partFeature]} />)
    await testNextCycleAsync()
    const samplePart = view.getPartByTestId(
      FakeScreenPositionFeature.partTestId
    )
    expect(samplePart).toHaveBeenDrawnAt({ x: { screen: 0 }, y: { screen: 0 } })

    // WHEN
    // await view.sendEvents([
    //   clickMouseRight({ x: { screen: 222 }, y: { screen: 333 } }),
    //   holdMouseRight({ x: { screen: 100 }, y: { screen: 200 } }),
    //   moveMouseTo({ x: { screen: 200 }, y: { screen: 250 } }),
    //   releaseMouseRight(),
    // ])

    // THEN
    // expect(samplePart).toHaveBeenDrawnAt({ x: { screen: 0 }, y: { screen: 0 } })
  })
})
