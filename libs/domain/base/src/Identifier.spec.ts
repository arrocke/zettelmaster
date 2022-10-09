import { ObjectId } from 'mongodb'
import Identifier, { InvalidIdentifierError } from './Identifier'

describe('constructon', () => {
	test('creates an Identifier from a string', () => {
		const str = new ObjectId().toHexString()
		const id = new Identifier(str)
		expect(id.value).toEqual(str)
	})

	test('creates an Identifier from an ObjectId', () => {
		const str = new ObjectId()
		const id = new Identifier(str)
		expect(id.value).toEqual(str.toHexString())
	})

	test('throw an error if the string is not a valid hex string', () => {
		const id = 'not an object id'
		expect(() => new Identifier('not an object id')).toThrowError(new InvalidIdentifierError(id))
	})
})

describe('generate', () => {
	test('creates a random Identifier', () => {
		const id1 = Identifier.generate()
		const id2 = Identifier.generate()
		expect(id1.value).toHaveLength(24)
		expect(id2.value).toHaveLength(24)
		expect(id1.value).not.toEqual(id2.value)
	})
})

describe('equals', () => {
	test('returns true if two Identifiers have the same hex string', () => {
		const id = new Identifier(new ObjectId())
		expect(id.equals(new Identifier(id.value))).toBe(true)
		expect(id.equals(new Identifier(new ObjectId()))).toBe(false)
	})
})