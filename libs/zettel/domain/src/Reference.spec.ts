import Reference from './Reference'

describe('create', () => {
  test('creates a new Reference with a random id', () => {
    const name = 'new reference'
    const creators = ['Adam', 'Eve']
    const reference = Reference.create({
      name,
      creators,
    })
    expect(reference.name).toEqual(name)
    expect(reference.creators).toEqual(creators)
    expect(reference.equals(Reference.create({ name, creators }))).toEqual(
      false
    )
  })
})

describe('update', () => {
  test('updates all properties on the Reference', () => {
    const reference = Reference.create({
      name: 'old name',
      creators: ['old creator'],
    })
    const name = 'new reference'
    const creators = ['Adam', 'Eve']
    const url = 'https://google.com'
    reference.update({ name, creators, url })
    expect(reference.name).toEqual(name)
    expect(reference.creators).toEqual(creators)
    expect(reference.url).toEqual(url)
  })

  test('does nothing with undefined', () => {
    const name = 'new reference'
    const creators = ['Adam', 'Eve']
    const url = 'https://google.com'
    const reference = Reference.create({ name, creators, url })
    reference.update({})
    expect(reference.name).toEqual(name)
    expect(reference.creators).toEqual(creators)
    expect(reference.url).toEqual(url)
  })

  test('unsets with undefined', () => {
    const name = 'new reference'
    const creators = ['Adam', 'Eve']
    const reference = Reference.create({
      name,
      creators,
      url: 'https://google.com',
    })
    reference.update({ url: null })
    expect(reference.name).toEqual(name)
    expect(reference.creators).toEqual(creators)
    expect(reference.url).toEqual(undefined)
  })
})
