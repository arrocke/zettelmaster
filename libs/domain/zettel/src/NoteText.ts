import { Identifier, ValueObject } from '@zettelmaster/domain/base'
import { DocumentNode, filterMarks, LinkMark } from './rich-text'

export * from './rich-text'

function findNoteLinks(document: DocumentNode): Identifier[] {
  const linkMarks = filterMarks(
    document,
    (mark) => mark.type === 'link' && !!mark.attrs.noteId
  ) as LinkMark[]
  return Array.from(
    new Set(linkMarks.map((link) => link.attrs.noteId ?? ''))
  ).map((id) => new Identifier(id))
}

export interface NoteTextData {
  document: DocumentNode
  links: readonly Identifier[]
}

/** Represents rich text content for a note. */
export default class NoteText extends ValueObject<NoteTextData> {
  get document() {
    return this._data.document
  }

  get links() {
    return this._data.links
  }

  static createFromDocument(doc: DocumentNode): NoteText {
    const links = findNoteLinks(doc)
    return new NoteText({ document: doc, links })
  }
}
