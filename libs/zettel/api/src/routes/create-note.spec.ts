import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import '../../test/connect-db'
import NoteModel from '../db/Note'

test('returns 400 if body is empty', async () => {
  const { body, status } = await agent.post('/notes')

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

test('returns 201 and creates new note', async () => {
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
