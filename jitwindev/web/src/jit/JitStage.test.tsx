import React from 'react';
import { render, screen } from '@testing-library/react';
import JitStage from './JitStage';
import { TestIds } from '../tests/TestIds';

describe('Edit mode', () => {
  it('When readonly mode, she sees readonly mode message', () => {
    render(<JitStage isReadonly />);

    expect(screen.getByText('readonly mode')).toBeInTheDocument();
  });

  it('When NOT readonly mode, she does NOT see readonly mode message', () => {
    render(<JitStage isReadonly={false} />);

    expect(screen.queryByText('readonly mode')).not.toBeInTheDocument();
  });
});

describe('She sees GuiView of MVFP', () => {
  it('She sees GuiView', () => {
    render(<JitStage isReadonly={false} />);
    expect(screen.getByTestId(TestIds.JIT_STAGE_GUI_VIEW)).toBeInTheDocument();
  });
});
