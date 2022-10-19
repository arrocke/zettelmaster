import '../../test/connect-db'
import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import NoteModel from '../db/Note'

test('returns 404 if note is not found', async () => {
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
  const note = await NoteModel.create({
    text: {
      type: 'doc',
      content: []
    }
  })

  const { body, status } = await agent.get(`/notes/${note._id}`)
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      id: note._id.toHexString(),
      text: note.text
    }
  })
})