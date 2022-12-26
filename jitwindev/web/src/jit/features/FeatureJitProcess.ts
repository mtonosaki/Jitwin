import { GuiFeature } from 'mvfp/GuiFeature';
import { GuiPartsCollection } from 'mvfp/GuiPartsCollection';
import { PartProcess } from '../parts/PartProcess';
import { LayerIds } from '../LayerIds';
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

    const process = Object.assign(new PartProcess(), {
      testId: JitTestIds.SAMPLE_JIT_PROCESS,
      codePosition: { x: { code: { m: 10 } }, y: { code: { m: 5 } } },
    });
    const layer = this.layer(LayerIds.JIT_PROCESS, () =>
      makeLayerForJitProcess()
    )!;
    layer.push({part: process, pane: this.targetPane });
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
