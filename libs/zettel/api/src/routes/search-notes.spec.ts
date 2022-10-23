import '../../test/connect-db'
import agent from '../../test/agent'
import NoteModel from '../db/Note'

beforeEach(async () => {
  await NoteModel.ensureIndexes()
})

test('returns 200 with the notes', async () => {
  const notes = await NoteModel.create([{
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'first' }]
      }]
    },
    searchString: 'first'
  },
  {
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'two' }]
      }]
    },
    searchString: 'two'
  }
  ])

  const { body, status } = await agent.get('/notes')
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: notes.map(note => ({
        id: note._id.toHexString(),
        preview: note.searchString
      }))
    }
  })
})

test('returns 200 with notes filtered by text', async () => {
  const notes = await NoteModel.create([{
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'first' }]
      }]
    },
    searchString: 'first'
  },
  {
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'two' }]
      }]
    },
    searchString: 'two'
  }
  ])

  const { body, status } = await agent.get('/notes').query({ text: 'two' })
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: [{
        id: notes[1]._id.toHexString(),
        preview: notes[1].searchString
      }]
    }
  })
})