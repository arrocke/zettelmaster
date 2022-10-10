import { Entity, Identifier } from '@zettelmaster/domain/base'
import NoteText from './NoteText'

export interface NoteData {
  text: NoteText
}

/** Represents a zettel note and its references and links. */
export default class Note extends Entity<NoteData> {
  /** The text document of the note. */
  get text() {
    return this._data.text.document
  }

  get links() {
    return this._data.text.links
  }

  /** Creates a new note with its text. */
  static create(data: NoteData): Note {
    return new Note(Identifier.generate(), data)
  }
}
