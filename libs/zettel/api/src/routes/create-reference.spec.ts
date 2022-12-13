import '../../test/connect-db'
import { ObjectId } from 'mongodb'
import agent from '../../test/agent'
import ReferenceModel from '../db/Reference'

test('returns 400 if text is invalid', async () => {
  const { body, status } = await agent.post('/references').send({})

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
  const { body, status, headers } = await agent.post('/references').send({ name: 'ref' })

  const reference = await ReferenceModel.findOne({}).lean()

  expect({ body, status, headers, note: reference }).toEqual({
    body: {},
    status: 201,
    note: {
      _id: expect.any(ObjectId),
      name: 'ref',
      creators: [],
      __v: 0,
    },
    headers: expect.objectContaining({
      location: `/references/${reference?._id}`,
    }),
  })
})
