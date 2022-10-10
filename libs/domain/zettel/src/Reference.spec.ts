import Reference from './Reference'

describe('create', () => {
  test('creates a new Reference with a random id', () => {
    const name = 'new reference'
    const reference = Reference.create({
      name,
    })
    expect(reference.name).toEqual(name)
    expect(
      reference.equals(
        Reference.create({
          name,
        })
      )
    ).toEqual(false)
  })
})
