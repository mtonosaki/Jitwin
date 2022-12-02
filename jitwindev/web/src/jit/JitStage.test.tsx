import React from 'react';
import { render, screen } from '@testing-library/react';
import JitStage from './JitStage';
import { TestIds } from '../tests/TestIds';
import { JitTestIds } from './tests/JitTestIds';
import { view } from '../mvfp/tests/View';
import {
  mvfpRender,
  testInitFeatureCycle,
  testNextCycleAsync,
} from '../mvfp/tests/mvfpRender.test';

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
  it('She sees a first PROCESS on the View', async () => {
    // WHEN
    testInitFeatureCycle();
    mvfpRender(<JitStage isReadonly={false} features={[]} />);
    await testNextCycleAsync();

    const samplePart = view.getPartByTestId(JitTestIds.SAMPLE_JIT_PROCESS);
    expect(samplePart).toBeInTheView();
    expect(samplePart).toHaveBeenDrawnAt({
      x: { screen: 10000 },
      y: { screen: 10000 },
    });
  });
});
