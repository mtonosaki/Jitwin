import React from 'react';

type PaneProps = {
  name: string;
  'data-testid'?: string;
};

export interface Pane {
  getName(): string;
}

export class GuiPane extends React.Component<PaneProps> implements Pane {
  // eslint-disable-next-line react/no-unused-class-component-methods
  getName(): string {
    const { name } = this.props;
    return name;
  }

  render() {
    const { 'data-testid': testId } = this.props;
    return <div data-testid={testId} />;
  }
}
