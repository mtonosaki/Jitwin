import { PaneState } from 'mvfp/ThreeCoordinatesSystem';
import { callbackAddLog, LogRecord } from 'mvfp/utils/LogSystem';
import {
  GuiPartsCollection,
  GuiPartsLayerCollection,
} from './GuiPartsCollection';
import { makeNewUuid } from './utils/uuid';

export abstract class GuiFeature {
  public readonly id: string = 'n/a';

  public enabled: boolean = true;

  // A shared layer collection automatically set by the GuiView.
  // Do not use this instance except for testing.
  protected partsLayers: GuiPartsLayerCollection = new Map();

  protected targetPane: PaneState = dummyPane;

  get pane(): PaneState {
    return this.targetPane;
  }

  constructor(id?: string) {
    this.id = id || makeNewUuid();
  }

  protected layer(
    layerNo: number,
    defaultInstanciater?: () => GuiPartsCollection
  ): GuiPartsCollection {
    const partsCollection = this.partsLayers.get(layerNo);
    if (partsCollection) {
      return partsCollection;
    }
    if (defaultInstanciater) {
      const newPartsCollection = defaultInstanciater();
      this.partsLayers.set(layerNo, newPartsCollection);
      return newPartsCollection;
    }
    throw new Error('FATAL ERROR: Could not find/generate layer');
  }

  public beforeRun(): void {}

  public run(): void {}

  public getName(): string {
    return this.constructor.name;
  }

  protected addLog: callbackAddLog = (log: LogRecord): void => {
    const now = new Date(Date.now());
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const level = `${log.level.substring(0, 1)}`;
    if (level === 'E') {
      // eslint-disable-next-line no-console
      console.error(`[${level}] ${hh}:${mm}:${ss} ${log.message}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[${level}] ${hh}:${mm}:${ss} ${log.message}`);
    }
  };

  public toString(): string {
    return `${this.getName()} id=${this.id} ${
      this.enabled ? 'enabled' : 'disabled'
    }`;
  }
}

export const dummyPane: PaneState = {
  name: 'dummyPane',
  paneTopLeft: { x: { screen: 1218 }, y: { screen: 99267 } },
  paneSize: { width: { screen: 23421234 }, height: { screen: 542811 } },
  scroll: { x: { screen: -9898567574 }, y: { screen: 21937457 } },
};
