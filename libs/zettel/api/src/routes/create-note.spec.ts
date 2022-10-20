import '../../test/connect-db'
import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import NoteModel from '../db/Note'

test('returns 400 if text is invalid', async () => {
  const { body, status } = await agent.post('/notes').send({ text: 'asdf' })

  expect({ body, status }).toEqual({
    body: {
      errors: [
        {
          code: 'InvalidRequest',
          message: 'could not understand request',
        },
      ],
    },
    status: 400,
  })
})

test('returns 201 and creates empty note', async () => {
  const emptyText = {
    type: 'doc',
    content: [{ type: 'paragraph', content: [] }],
  }
  const { body, status, headers } = await agent.post('/notes').send()

  const note = await NoteModel.findOne({}).lean()

  expect({ body, status, headers, note }).toEqual({
    body: {},
    status: 201,
    note: {
      _id: expect.any(ObjectId),
      text: emptyText,
      links: [],
      references: [],
      __v: 0,
    },
    headers: expect.objectContaining({
      location: `/notes/${note?._id}`,
    }),
  })
})


test('returns 201 and creates new note with text', async () => {
  const text = {
    type: 'doc',
    content: [],
  }
  const { body, status, headers } = await agent.post('/notes').send({
    text,
  })

  const note = await NoteModel.findOne({}).lean()

  expect({ body, status, headers, note }).toEqual({
    body: {},
    status: 201,
    note: {
      _id: expect.any(ObjectId),
      text,
      links: [],
      references: [],
      __v: 0,
    },
    headers: expect.objectContaining({
      location: `/notes/${note?._id}`,
    }),
  })
})
