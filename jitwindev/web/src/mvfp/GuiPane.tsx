import React from 'react';
import { ScreenPosition, screenPosition0 } from './ThreeCoordinatesSystem';

type PaneProps = {
  name: string;
  'data-testid'?: string;
};

export interface Pane {
  getName(): string;
  get scroll(): ScreenPosition;
  set scroll(newPos: ScreenPosition);
}

export class GuiPane extends React.Component<PaneProps> implements Pane {
  private currentScroll: ScreenPosition = screenPosition0;

  // eslint-disable-next-line react/no-unused-class-component-methods
  getName(): string {
    const { name } = this.props;
    return name;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  get scroll(): ScreenPosition {
    return this.currentScroll;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  set scroll(pos) {
    this.currentScroll = pos;
  }

  render() {
    const { 'data-testid': testId } = this.props;
    return <div data-testid={testId} />;
  }
}
