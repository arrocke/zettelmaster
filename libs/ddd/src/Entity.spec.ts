import Entity from './Entity'
import Identifier from './Identifier'

interface EntityData {
  str?: string
}
class TestEntity extends Entity<EntityData> {
  get data() {
    return this._data
  }
}

describe('construction', () => {
  test('creates new entity with data and identity', () => {
    const id = Identifier.generate()
    const data = { str: 'hello world' }
    const entity = new TestEntity(id, data)
    expect(entity.id).toBe(id)
    expect(entity.data).toBe(data)
  })
})

describe('equals', () => {
  test('returns true if Entities have the same identity', () => {
    const id = Identifier.generate()
    const data = { str: 'hello world' }
    const entity = new TestEntity(id, data)
    expect(
      entity.equals(new TestEntity(id, { str: 'something different' }))
    ).toEqual(true)
    expect(entity.equals(new TestEntity(Identifier.generate(), data))).toEqual(
      false
    )
  })
})
