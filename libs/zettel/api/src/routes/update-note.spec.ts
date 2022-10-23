import '../../test/connect-db'
import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import NoteModel from '../db/Note'

test('returns 404 if note is not found', async () => {
  const { body, status } = await agent.patch(`/notes/${new ObjectId().toHexString()}`).send({
    text: {
      type: 'doc',
      content: []
    }
  })
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

test('returns 204 and updates note', async () => {
  const note = await NoteModel.create({
    text: {
      type: 'doc',
      content: []
    }
  })
  const newData = {
    text: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'asdf'
        }]
      }]
    }
  }
  const { body, status } = await agent.patch(`/notes/${note._id}`).send(newData)

  const updatedNote = await NoteModel.findById(note._id).lean()

  expect({ body, status, updatedNote }).toEqual({
    status: 204,
    body: {},
    updatedNote: {
      ...newData,
      _id: note._id,
      __v: 0,
      links: [],
      references: [],
      searchString: 'asdf'
    }
  })
})