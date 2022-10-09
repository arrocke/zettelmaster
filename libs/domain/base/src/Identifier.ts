import { ObjectId } from 'mongodb'

export class IdentifierError extends Error {
	constructor(value: string) {
		super(`Cannot construct an Identifier from the string "${value}".`)
	}
}

/** Represents an unique ID for use in mongo databases. */
export default class Identifier {
	private readonly _id: ObjectId

	/** The value of the identfier as a string. */
	get value(): string {
		return this._id.toHexString()
	}

	/** Tests whether another Identifier is equal to this one. */
	equals(other: Identifier) {
		return this._id.equals(other._id)
	}

	/**
	 * Create an Identifier from the raw ID value.
	 * @param id The raw value of the mongo identifier. Strings will be converted to an ObjectId.
	 */
	constructor(id: string | ObjectId) {
		if (typeof id === 'string') {
			try {
				this._id = ObjectId.createFromHexString(id)
			} catch (error) {
				throw new IdentifierError(id)
			}
		} else {
			this._id = id
		}
	}

	/**
	 * Generate an Identifier with a pseudo-random value.
	 * @returns A new Identifier with a random value.
	 */
	static generate() {
		return new Identifier(new ObjectId())
	}
}