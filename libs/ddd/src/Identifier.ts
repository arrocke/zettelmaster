import { ObjectId } from 'mongodb'

/** Thrown when an Identifier could not be created from a string because it is not a valid ObjectId hex string. */
export class InvalidIdentifierError extends Error {
  constructor(value: string) {
    super(`Cannot construct an Identifier from the string "${value}".`)
  }
}

/** Represents an unique ID for use in mongo databases. */
export default class Identifier {
  readonly _value: ObjectId

  /** The value of the identfier as a string. */
  get value(): string {
    return this._value.toHexString()
  }

  /** Tests whether another Identifier is equal to this one. */
  equals(other: Identifier) {
    return this._value.equals(other._value)
  }

  /**
   * Create an Identifier from the raw ID value.
   * @param id The raw value of the mongo identifier. Strings will be converted to an ObjectId.
   * @throws {InvalidIdentifierError} When the string value to create the Identifier from is not a valid ObjectId hex string.
   */
  constructor(id: string | ObjectId) {
    if (typeof id === 'string') {
      try {
        this._value = ObjectId.createFromHexString(id)
      } catch (error) {
        throw new InvalidIdentifierError(id)
      }
    } else {
      this._value = id
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
