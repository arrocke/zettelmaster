import { Entity, Identifier } from '@zettelmaster/domain/base'

export interface ReferenceData {
  name: string
}

/** Represents a reference used in zettel notes. */
export default class Reference extends Entity<ReferenceData> {
  get name() {
    return this._data.name
  }

  /** Creates a new Reference. */
  static create(data: ReferenceData): Reference {
    return new Reference(Identifier.generate(), data)
  }
}
