import { GuiFeature } from 'mvfp/GuiFeature';
import { GuiPartsCollection } from 'mvfp/GuiPartsCollection';
import { ScreenX, ScreenY } from 'mvfp/ThreeCoordinatesSystem';
import { newLog } from 'mvfp/utils/LogSystem';
import { LayerIds } from '../LayerIds';
import { PartProcess } from '../parts/PartProcess';
import {
  codeToLayoutLogicalSpaceX,
  codeToLayoutLogicalSpaceY,
  layoutToCodeLogicalSpaceX,
  layoutToCodeLogicalSpaceY,
} from '../PositionConverters';
import { JitTestIds } from '../tests/JitTestIds';

export class FeatureJitProcess extends GuiFeature {
  override beforeRun() {
    super.beforeRun();
    this.addLog(newLog('ok...feature JitProcess'));

    // make sample process
    const process = Object.assign(new PartProcess(), {
      testId: JitTestIds.SAMPLE_JIT_PROCESS,
      codePosition: { x: { code: { m: 10 } }, y: { code: { m: 5 } } },
    });
    const layer = this.layer(LayerIds.JIT_PROCESS, makeLayerForJitProcess)!;
    layer.push({ part: process, pane: this.targetPane });

    // scroll the sample to the center of the view.
    const positioner = {
      converters: layer.getConverters(),
      pane: this.targetPane,
    };
    const pos = process.getScreenPosition(positioner);
    const { paneSize, paneTopLeft } = this.targetPane;
    const dx: ScreenX = {
      screen: paneSize.width.screen / 2 + paneTopLeft.x.screen - pos.x.screen,
    };
    const dy: ScreenY = {
      screen: paneSize.height.screen / 2 + paneTopLeft.y.screen - pos.y.screen,
    };
    this.targetPane.scroll = { x: dx, y: dy };
  }
}

function makeLayerForJitProcess(): GuiPartsCollection {
  const layer = new GuiPartsCollection();
  layer.codeToLayout = {
    convertX: codeToLayoutLogicalSpaceX,
    convertY: codeToLayoutLogicalSpaceY,
  };
  layer.layoutToCode = {
    convertX: layoutToCodeLogicalSpaceX,
    convertY: layoutToCodeLogicalSpaceY,
  };
  return layer;
}
