import { makeNewUuid } from './uuid'

describe('makeUuid', () => {
  it('contains 0-9, a-f and hyphen', () => {
    // GIVEN
    const spyRandom = jest.spyOn(Math, 'random')
    for (let i = 0; i < 32; i += 1) {
      spyRandom.mockReturnValueOnce((i % 16) / 16)
    }

    // WHEN
    const uuid = makeNewUuid()

    // THEN
    expect(uuid).toBe('01234567-89ab-cdef-0123-456789abcdef')
  })
})
