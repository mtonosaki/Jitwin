import { GuiFeature } from './GuiFeature';

describe('General', () => {
  it('toString returns feature instance information', () => {
    class DummyFeature extends GuiFeature {}
    const feature1 = new DummyFeature('a01');
    expect(feature1.toString()).toBe('DummyFeature id=a01 enabled');

    feature1.enabled = false;
    expect(feature1.toString()).toBe('DummyFeature id=a01 disabled');
  });

  it('Returns feature class name', () => {
    // GIVEN - 1
    class DummyFeature extends GuiFeature {}

    // WHEN - 1
    const feature1 = new DummyFeature();

    // THEN -1
    expect(feature1.getName()).toBe('DummyFeature');

    // GIVEN - 2
    class NestedDummyFeature extends DummyFeature {}

    // WHEN - 2
    const feature2 = new NestedDummyFeature();

    // THEN - 2
    expect(feature2.getName()).toBe('NestedDummyFeature');
  });
});
