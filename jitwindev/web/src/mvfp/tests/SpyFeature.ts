import GuiFeature from '../GuiFeature';

export default class SpyFeature extends GuiFeature {
  constructor() {
    super();
    this.beforeRun = jest.fn();
    this.run = jest.fn();
  }
}
