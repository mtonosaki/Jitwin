import React from 'react';
import {
  ScreenPosition,
  screenPosition0,
  ScreenSize,
  screenSize0,
} from './ThreeCoordinatesSystem';

export interface Pane {
  get name(): string;

  get scroll(): ScreenPosition;

  set scroll(newPosition: ScreenPosition);

  get paneTopLeft(): ScreenPosition;

  get paneSize(): ScreenSize;
}

type PaneProps = {
  name: string;
  'data-testid'?: string;
  style?: React.CSSProperties;
};

export class GuiPane extends React.Component<PaneProps> implements Pane {
  private currentScroll: ScreenPosition = screenPosition0;

  private refPane: React.RefObject<HTMLDivElement>;

  constructor(props: Readonly<PaneProps>) {
    super(props);
    this.refPane = React.createRef<HTMLDivElement>();
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  get name(): string {
    const { name } = this.props;
    return name;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  get paneSize(): ScreenSize {
    const pane = this.refPane.current;
    if (pane) {
      const clientRect = pane.getBoundingClientRect();
      return {
        width: { screen: clientRect.width },
        height: { screen: clientRect.height },
      };
    }
    return screenSize0;
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  get paneTopLeft(): ScreenPosition {
    const pane = this.refPane.current;
    if (pane) {
      const clientRect = pane.getBoundingClientRect();
      return {
        x: { screen: clientRect.left },
        y: { screen: clientRect.top },
      };
    }
    return screenPosition0;
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
    const { 'data-testid': testId, style } = this.props;
    return <div data-testid={testId} ref={this.refPane} style={style} />;
  }
}
