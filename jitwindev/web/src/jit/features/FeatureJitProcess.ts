import { GuiFeature } from '../../mvfp/GuiFeature';
import { PartProcess } from '../parts/PartProcess';
import { LayerIds } from '../LayerIds';
import { GuiPartsCollection } from '../../mvfp/GuiPartsCollection';
import {
  codeToLayoutLogicalSpaceX,
  codeToLayoutLogicalSpaceY,
  layoutToCodeLogicalSpaceX,
  layoutToCodeLogicalSpaceY,
  layoutToScreenX,
  layoutToScreenY,
  screenToLayoutX,
  screenToLayoutY,
} from '../PositionConverters';
import { JitTestIds } from '../tests/JitTestIds';

export class FeatureJitProcess extends GuiFeature {
  override beforeRun() {
    super.beforeRun();
    const process = Object.assign(new PartProcess(), {
      testId: JitTestIds.SAMPLE_JIT_PROCESS,
      codePosition: { x: { code: { m: 10 } }, y: { code: { m: 10 } } },
    });
    const layer = this.layer(LayerIds.JIT_PROCESS, () =>
      makeLayerForJitProcess()
    )!;
    layer.push(process);
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
  layer.layoutToScreen = {
    convertX: layoutToScreenX,
    convertY: layoutToScreenY,
  };
  layer.screenToLayout = {
    convertX: screenToLayoutX,
    convertY: screenToLayoutY,
  };
  return layer;
}
