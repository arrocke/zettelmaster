import '../../test/connect-db'
import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import NoteModel from '../db/Note'

test('returns 200 with notes', async () => {
  const { body, status } = await agent.get(`/notes/${new ObjectId().toHexString()}`)
  expect({ body, status }).toEqual({
    status: 404,
    body: {
      errors: [
        {
          code: 'NotFound',
          message: "Note not found."
        }
      ]
    }
  })
})

test('returns 200 with the note', async () => {
  const notes = await NoteModel.create([{
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'first' }]
      }]
    }
  },
  {
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'two' }]
      }]
    }
  }
  ])

  const { body, status } = await agent.get('/notes')
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: notes.map(note => ({
        id: note._id.toHexString(),
      }))
    }
  })
})