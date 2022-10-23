import { Identifier } from '@zettelmaster/ddd'
import { NoteText, Note } from '@zettelmaster/zettel/domain'
import { ObjectId } from 'mongodb'
import NoteRepo from './NoteRepo'
import NoteModel from '../db/Note'
import '../../test/connect-db'

const repo = new NoteRepo()

describe('findById', () => {
  test('returns a Note for a found document', async () => {
    const note = new Note(Identifier.generate(), {
      text: NoteText.createFromDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'link',
                marks: [
                  {
                    type: 'noteLink',
                    attrs: { noteId: Identifier.generate().value },
                  },
                ],
              },
              {
                type: 'reference',
                attrs: { id: Identifier.generate().value },
                content: [],
              },
            ],
          },
        ],
      }),
    })
    await NoteModel.insertMany([
      {
        _id: note.id._value,
        text: note._data.text._data.document,
        links: note._data.text._data.links.map((link) => link._value),
        references: note._data.text._data.references.map((link) => link._value),
        searchString: note._data.text._data.searchString
      },
    ])
    await expect(repo.findById(note.id.value)).resolves.toEqual(note)
  })

  test('returns undefined when nothing is found', async () => {
    await expect(repo.findById(new ObjectId().toHexString())).resolves.toEqual(
      undefined
    )
    await expect(repo.findById('not an object id')).resolves.toEqual(undefined)
  })
})

describe('commit', () => {
  test('creates a new document when none is found', async () => {
    const note = new Note(Identifier.generate(), {
      text: NoteText.createFromDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'link',
                marks: [
                  {
                    type: 'noteLink',
                    attrs: { noteId: Identifier.generate().value },
                  },
                ],
              },
              {
                type: 'reference',
                attrs: { id: Identifier.generate().value },
                content: [],
              },
            ],
          },
        ],
      }),
    })
    await repo.commit(note)
    const dbNote = await NoteModel.findById(note.id._value).lean()
    expect(dbNote).toEqual({
      _id: note.id._value,
      text: note._data.text._data.document,
      links: note._data.text._data.links.map((link) => link._value),
      references: note._data.text._data.references.map(
        (reference) => reference._value
      ),
      searchString: 'link',
      __v: 0,
    })
  })

  test('updates existing document when one is found', async () => {
    const note = new Note(Identifier.generate(), {
      text: NoteText.createFromDocument({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'link',
                marks: [
                  {
                    type: 'noteLink',
                    attrs: { noteId: Identifier.generate().value },
                  },
                ],
              },
              {
                type: 'reference',
                attrs: { id: Identifier.generate().value },
                content: [],
              },
            ],
          },
        ],
      }),
    })
    await NoteModel.insertMany([
      {
        _id: note.id._value,
        text: { type: 'doc', content: [] },
        links: [],
        references: [],
      },
    ])
    await repo.commit(note)
    const dbNote = await NoteModel.findById(note.id._value).lean()
    expect(dbNote).toEqual({
      _id: note.id._value,
      text: note._data.text._data.document,
      links: note._data.text._data.links.map((link) => link._value),
      references: note._data.text._data.references.map(
        (reference) => reference._value
      ),
      searchString: 'link',
      __v: 0,
    })
  })
})
