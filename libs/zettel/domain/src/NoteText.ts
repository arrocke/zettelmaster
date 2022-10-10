import { Identifier, ValueObject } from '@zettelmaster/ddd'
import {
  DocumentNode,
  filterMarks,
  filterNodes,
  LinkMark,
  ReferenceNode,
} from './rich-text'

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

function findReferences(document: DocumentNode): Identifier[] {
  const referenceNodes = filterNodes(
    document,
    (node) => node.type === 'reference'
  ) as ReferenceNode[]
  return Array.from(new Set(referenceNodes.map((node) => node.attrs.id))).map(
    (id) => new Identifier(id)
  )
}

export interface NoteTextData {
  document: DocumentNode
  links: Identifier[]
  references: Identifier[]
}

/** Represents rich text content for a note. */
export default class NoteText extends ValueObject<NoteTextData> {
  /** The JSON representation of the rich text document */
  get document(): DocumentNode {
    return this._data.document
  }

  /** The list of note ids linked to in the document. */
  get links(): readonly Identifier[] {
    return this._data.links
  }

  /** The list of external references in the document. */
  get references(): readonly Identifier[] {
    return this._data.references
  }

  /** Creates a new NoteText from a rich text document representation. */
  static createFromDocument(doc: DocumentNode): NoteText {
    const links = findNoteLinks(doc)
    const references = findReferences(doc)
    return new NoteText({ document: doc, links, references })
  }
}
