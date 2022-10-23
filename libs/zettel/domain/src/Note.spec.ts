import { Identifier } from '@zettelmaster/ddd'
import { DocumentNode } from '@zettelmaster/rich-text'
import Note from './Note'
import NoteText from './NoteText'

describe('create', () => {
  test('creates a new Note with a random id', () => {
    const text: DocumentNode = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    }
    const note = Note.create({
      text: new NoteText({ document: text, links: [], references: [], searchString: '' }),
    })
    expect(note.text).toEqual(text)
    expect(note.links).toEqual([])
    expect(
      note.equals(
        Note.create({
          text: new NoteText({ document: text, links: [], references: [], searchString: '' }),
        })
      )
    ).toEqual(false)
  })
})

describe('updateText', () => {
  test('update the text of the note', () => {
    const note = Note.create({
      text: new NoteText({
        document: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [] }],
        },
        links: [],
        references: [],
        searchString: ''
      }),
    })
    const linkIds = [Identifier.generate()]
    const referenceIds = [Identifier.generate()]
    const newDoc: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'note link',
              marks: [{ type: 'noteLink', attrs: { noteId: linkIds[0].value } }],
            },
            {
              type: 'reference',
              attrs: { id: referenceIds[0].value },
              content: [],
            },
          ],
        },
      ],
    }
    const newText = NoteText.createFromDocument(newDoc)
    note.updateText(newText)
    expect(note.text).toEqual(newDoc)
    expect(note.links).toEqual(linkIds)
    expect(note.references).toEqual(referenceIds)
    expect(note.searchString).toEqual('note link')
  })
})
