import React from 'react';
import { ScreenPosition, screenPosition0 } from './ThreeCoordinatesSystem';

export interface Pane {
  get name(): string;
  get scroll(): ScreenPosition;
  set scroll(newPosition: ScreenPosition);
}

type PaneProps = {
  name: string;
  'data-testid'?: string;
};

export class GuiPane extends React.Component<PaneProps> implements Pane {
  private currentScroll: ScreenPosition = screenPosition0;

  // eslint-disable-next-line react/no-unused-class-component-methods
  get name(): string {
    const { name } = this.props;
    return name;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  get scroll(): ScreenPosition {
    return this.currentScroll;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  set scroll(newPosition) {
    this.currentScroll = newPosition;
  }

  render() {
    const { 'data-testid': testId } = this.props;
    return <div data-testid={testId} />;
  }
}
