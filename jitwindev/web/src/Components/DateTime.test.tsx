import React from 'react';
import { render, screen } from '@testing-library/react';
import DateTime from './DateTime';

describe('Design', () => {
  it('Sophie sees real-time value', () => {
    const expectedTime = new Date('2022/10/28 13:34:45');
    render(<DateTime value={expectedTime.getTime()} vr="Real" />);

    expect(screen.getByText('13:34')).toBeInTheDocument();
    expect(screen.getByText(':45')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'real time' })).toBeInTheDocument();
  });

  it('Sophie sees virtual-time value', () => {
    const expectedTime = new Date('2022/10/28 13:34:45');
    render(<DateTime value={expectedTime.getTime()} vr="Virtual" />);

    expect(screen.getByText('13:34')).toBeInTheDocument();
    expect(screen.getByText(':45')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'virtual time' })
    ).toBeInTheDocument();
  });

  it('time values should have 0 padding', () => {
    const expectedTime = new Date('2022/10/28 09:08:00');
    render(<DateTime value={expectedTime.getTime()} vr="Real" />);

    expect(screen.getByText('09:08')).toBeInTheDocument();
    expect(screen.getByText(':00')).toBeInTheDocument();
  });
});
