import { Identifier } from '@zettelmaster/domain/base'
import NoteText, { DocumentNode } from './NoteText'

describe('createFromDocument', () => {
  test('creates NoteText with list of links and reference ids in the document', () => {
    const linkIds = [Identifier.generate(), Identifier.generate()]
    const referenceIds = [Identifier.generate(), Identifier.generate()]
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
              marks: [{ type: 'link', attrs: { noteId: linkIds[0].value } }],
            },
            {
              type: 'text',
              text: 'another link, ',
              marks: [{ type: 'link', attrs: { noteId: linkIds[1].value } }],
            },
            {
              type: 'text',
              text: 'web link',
              marks: [{ type: 'link', attrs: { href: 'https://google.com' } }],
            },
            {
              type: 'reference',
              attrs: { id: referenceIds[0].value },
              content: [],
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
                        { type: 'link', attrs: { noteId: linkIds[0].value } },
                      ],
                    },
                    {
                      type: 'reference',
                      attrs: { id: referenceIds[1].value },
                      content: [],
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
    expect(note.links).toEqual(linkIds)
    expect(note.references).toEqual(referenceIds)
  })

  test('creates NoteText with empty lists of links and references if none are found', () => {
    const doc: DocumentNode = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    }
    const note = NoteText.createFromDocument(doc)
    expect(note.document).toEqual(doc)
    expect(note.links).toEqual([])
    expect(note.references).toEqual([])
  })
})
