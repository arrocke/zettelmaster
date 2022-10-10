import { Identifier } from '@zettelmaster/ddd'
import { NoteText, Note } from '@zettelmaster/zettel/domain'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import NoteRepo from './NoteRepo'
import NoteModel from '../db/Note'

const repo = new NoteRepo()

beforeAll(async () => {
  await mongoose.connect(
    'mongodb+srv://test:asdf@zettelcluster.iktudug.mongodb.net?retryWrites=true&w=majority',
    { dbName: `jest-${process.env.JEST_WORKER_ID}` }
  )
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  for await (const collection of mongoose.connection.db.listCollections()) {
    await mongoose.connection.dropCollection(collection.name)
  }
})

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
                    type: 'link',
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
                    type: 'link',
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
                    type: 'link',
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
      __v: 0,
    })
  })
})
