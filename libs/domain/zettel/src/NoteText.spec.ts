import { Identifier } from '@zettelmaster/domain/base'
import NoteText, { DocumentNode } from './NoteText'

describe('createFromDocument', () => {
  test('creates NoteText with list of note ids in the document', () => {
    const ids = [Identifier.generate(), Identifier.generate()]
    const doc: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Beginning text, ' },
            {
              type: 'text',
              text: 'linked text, ',
              marks: [{ type: 'link', attrs: { noteId: ids[0].value } }],
            },
            {
              type: 'text',
              text: 'another link, ',
              marks: [{ type: 'link', attrs: { noteId: ids[1].value } }],
            },
            {
              type: 'text',
              text: 'web link',
              marks: [{ type: 'link', attrs: { href: 'https://google.com' } }],
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'lineItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'duplicate link',
                      marks: [
                        { type: 'link', attrs: { noteId: ids[0].value } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }

    const note = NoteText.createFromDocument(doc)
    expect(note.document).toEqual(doc)
    expect(note.links).toEqual(ids)
  })

  test('creates NoteText with empty list of links if none are found', () => {
    const doc: DocumentNode = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    }
    const note = NoteText.createFromDocument(doc)
    expect(note.document).toEqual(doc)
    expect(note.links).toEqual([])
  })
})
