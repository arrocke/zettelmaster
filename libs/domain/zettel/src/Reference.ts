import { Entity, Identifier } from '@zettelmaster/domain/base'

export interface ReferenceData {
  name: string
  creators: string[]
  url?: string
}

export type UpdateReferenceData = {
  name?: string
  creators?: string[]
  url?: string | null
}

/** Represents a resource referenced in zettel notes. */
export default class Reference extends Entity<ReferenceData> {
  /** The name of the resource. */
  get name() {
    return this._data.name
  }

  /** The list of creators of the resource. */
  get creators(): readonly string[] {
    return this._data.creators
  }

  /** The URL to access the resource with. */
  get url(): string | undefined {
    return this._data.url
  }

  /** Creates a new Reference. */
  static create(data: ReferenceData): Reference {
    return new Reference(Identifier.generate(), data)
  }

  /**
   * Partial update of fields on the Reference.
   * Passing undefined will ignore that property,
   * while passing null will remove that property.
   */
  update(data: Partial<UpdateReferenceData>) {
    if (typeof data.name !== 'undefined') {
      this._data.name = data.name
    }
    if (typeof data.creators !== 'undefined') {
      this._data.creators = data.creators
    }
    if (typeof data.url !== 'undefined') {
      if (data.url === null) {
        delete this._data.url
      } else {
        this._data.url = data.url
      }
    }
  }
}
