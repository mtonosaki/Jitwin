import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from '../mvfp/tests/mvfpRender';
import { view } from '../mvfp/tests/View';
import { TestIds } from '../tests/TestIds';
import JitStage from './JitStage';
import { JitTestIds } from './tests/JitTestIds';

describe('Edit mode', () => {
  it('When readonly mode, she sees readonly mode message', () => {
    render(<JitStage isReadonly features={[]} />);

    expect(screen.getByText('readonly mode')).toBeInTheDocument();
  });

  it('When NOT readonly mode, she does NOT see readonly mode message', () => {
    render(<JitStage isReadonly={false} features={[]} />);

    expect(screen.queryByText('readonly mode')).not.toBeInTheDocument();
  });
});

describe('She sees GuiView of MVFP', () => {
  it('She sees GuiView', () => {
    render(<JitStage isReadonly={false} features={[]} />);
    expect(screen.getByTestId(TestIds.JIT_STAGE_GUI_VIEW)).toBeInTheDocument();
  });
});

describe('Sample', () => {
  it('She sees a first PROCESS on the center of the view', async () => {
    // GIVEN
    testInitFeatureCycle();
    const stubClientWidth = jest.spyOn(
      HTMLDivElement.prototype,
      'clientWidth',
      'get'
    );
    const stubClientHeight = jest.spyOn(
      HTMLDivElement.prototype,
      'clientHeight',
      'get'
    );
    stubClientWidth.mockReturnValue(1728);
    stubClientHeight.mockReturnValue(576);

    // WHEN
    mvfpRender(<JitStage isReadonly={false} features={[]} />);
    await testNextCycleAsync();

    // THEN
    const samplePart = view.getPartByTestId(JitTestIds.SAMPLE_JIT_PROCESS);
    expect(samplePart).toBeInTheView();
    expect(samplePart).toHaveBeenDrawnAt({
      x: { screen: 864 }, // center x = 1728 / 2
      y: { screen: 288 }, // center y = 576 / 2
    });

    // RESTORE
    stubClientWidth.mockRestore();
    stubClientHeight.mockRestore();
  });
});
