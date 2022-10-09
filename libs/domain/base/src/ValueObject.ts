import deepEqual from "deep-equal";

/**
 * Represents objects without identity or lifecycle.
 * Value objects should be immutable since they do not have a lifecycle. 
 */
export default abstract class ValueObject<T> {
	protected _data: T;

	/** Create a ValueObject from its raw data. */
	constructor(data: T) {
		this._data = Object.freeze(data)
	}

	/**
	 * Tests whether another ValueObject is equal to this one.
	 * ValueObjects are equal if their data is deeply equal. 
	 */
	equals(other: ValueObject<T>) {
		return deepEqual(this._data, other._data)
	}
}