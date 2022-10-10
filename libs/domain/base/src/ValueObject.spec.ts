import ValueObject from './ValueObject'

interface TestValueObjectData {
  str?: string
  obj: { bool: boolean; n: number }
  arr: number[]
}
class TestValueObject extends ValueObject<TestValueObjectData> {
  get data() {
    return this._data
  }
}

describe('construction', () => {
  test('creates ValueObject with immutable props', () => {
    const data: TestValueObjectData = {
      str: 'hello world',
      obj: {
        bool: true,
        n: 12,
      },
      arr: [1, 2, 3, 4, 5],
    }
    const obj = new TestValueObject(data)

    expect(obj.data).toEqual(data)
    expect(Object.isFrozen(obj.data)).toBe(true)
  })
})

describe('equals', () => {
  test('returns true if ValueObjects have the same deeply nested value', () => {
    const data: TestValueObjectData = {
      str: 'hello world',
      obj: {
        bool: true,
        n: 12,
      },
      arr: [1, 2, 3, 4, 5],
    }
    const obj = new TestValueObject(data)

    expect(obj.equals(new TestValueObject({ ...data }))).toBe(true)

    expect(
      obj.equals(new TestValueObject({ ...data, str: 'something different' }))
    ).toBe(false)
    expect(
      obj.equals(new TestValueObject({ obj: data.obj, arr: data.arr }))
    ).toBe(false)
    expect(
      obj.equals(new TestValueObject({ ...data, obj: { bool: false, n: 12 } }))
    ).toBe(false)
    expect(
      obj.equals(new TestValueObject({ ...data, arr: [1, 2, 3, 5] }))
    ).toBe(false)
  })
})
