import type Identifier from "./Identifier";

/** Represents objects with a unique identity and lifecycle.  */
export default abstract class Entity<T> {
	/** Create an Entity from its identifier and raw data. */
	constructor(public readonly id: Identifier, protected _data: T) {}

	/**
	 * Test whether another Entity is equal to this one.
	 * Entities are equal if they have the same identifier, even if their data is different.
	 */
	equals(other: Entity<T>) {
		return this.id.equals(other.id)
	}
}