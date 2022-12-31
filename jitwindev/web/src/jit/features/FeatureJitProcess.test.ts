import { FeatureJitProcess } from 'jit/features/FeatureJitProcess';
import { LayerIds } from 'jit/LayerIds';
import { PartProcess } from 'jit/parts/PartProcess';
import {
  codeToLayoutLogicalSpaceX,
  codeToLayoutLogicalSpaceY,
  layoutToCodeLogicalSpaceX,
  layoutToCodeLogicalSpaceY,
} from 'jit/PositionConverters';
import { JitTestIds } from 'jit/tests/JitTestIds';
import { makeFeatureTester } from 'mvfp/tests/featureTester';

describe('Feature JitProcess', () => {
  it('Sophie have a sample process', () => {
    // GIVEN
    const feature = new FeatureJitProcess();

    // WHEN
    feature.beforeRun();

    // THEN
    const theFeatureHandler = makeFeatureTester(feature);
    const layer = theFeatureHandler.layer(LayerIds.JIT_PROCESS);
    const converter = layer.getConverters();
    expect(converter.codeToLayout.convertX).toEqual(codeToLayoutLogicalSpaceX);
    expect(converter.codeToLayout.convertY).toEqual(codeToLayoutLogicalSpaceY);
    expect(converter.layoutToCode.convertX).toEqual(layoutToCodeLogicalSpaceX);
    expect(converter.layoutToCode.convertY).toEqual(layoutToCodeLogicalSpaceY);
    const partAndPanes = layer.filter(
      (it) => it.part.testId === JitTestIds.SAMPLE_JIT_PROCESS
    );
    expect(partAndPanes).toHaveLength(1);
    const { part, pane } = partAndPanes[0];
    expect(pane).toBe(feature.pane);
    expect(part).toBeInstanceOf(PartProcess);
    expect(part.peekCodePositionAsAny()).toEqual({
      x: { code: { m: 10 } },
      y: { code: { m: 5 } },
    });
  });
});
