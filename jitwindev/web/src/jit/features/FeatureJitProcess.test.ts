import { FeatureJitProcess } from 'jit/features/FeatureJitProcess'

describe('Feature JitProcess', () => {
  it('Sophie have a sample process', () => {
    // GIVEN
    const feature = new FeatureJitProcess();

    // WHEN
    feature.beforeRun();

    // THEN
    feature.layer()
  });
});