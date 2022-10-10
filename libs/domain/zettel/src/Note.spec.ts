import Note from './Note'
import NoteText, { DocumentNode } from './NoteText'

describe('create', () => {
  test('creates a new note with a random id', () => {
    const text: DocumentNode = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    }
    const note = Note.create({
      text: new NoteText({ document: text, links: [] }),
    })
    expect(note.text).toEqual(text)
    expect(note.links).toEqual([])
    expect(
      note.equals(
        Note.create({
          text: new NoteText({ document: text, links: [] }),
        })
      )
    ).toEqual(false)
  })
})
