import '../../test/connect-db'
import agent from '../../test/agent'
import ReferenceModel from '../db/Reference'

beforeEach(async () => {
  await ReferenceModel.ensureIndexes()
})

test('returns 200 with the notes', async () => {
  const references = await ReferenceModel.create([{
    name: 'Reference One',
    creators: ['Person A'],
    url: 'https://google.com'
  },
  {
    name: 'Reference Two',
    creators: ['Person B']
  }
  ])

  const { body, status } = await agent.get('/references')
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: references.map(reference => ({
        id: reference._id.toHexString(),
        name: reference.name,
        creators: reference.creators,
        url: reference.url
      }))
    }
  })
})

test('returns 200 with notes filtered by text', async () => {
  const references = await ReferenceModel.create([{
    name: 'Reference One',
    creators: ['Person A'],
    url: 'https://google.com'
  },
  {
    name: 'Reference Two',
    creators: ['Person B']
  }
  ])

  const { body, status } = await agent.get('/references').query({ text: 'two' })
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: [{
        id: references[1]._id.toHexString(),
        name: references[1].name,
        creators: references[1].creators,
        url: references[1].url
      }]
    }
  })
})

test('returns 200 with notes filtered by creator', async () => {
  const references = await ReferenceModel.create([{
    name: 'Reference One',
    creators: ['Person A'],
    url: 'https://google.com'
  },
  {
    name: 'Reference Two',
    creators: ['Person B']
  }
  ])

  const { body, status } = await agent.get('/references').query({ text: '"Person A"' })
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: [{
        id: references[0]._id.toHexString(),
        name: references[0].name,
        creators: references[0].creators,
        url: references[0].url
      }]
    }
  })
})

test('returns 200 with notes filtered by url', async () => {
  const references = await ReferenceModel.create([{
    name: 'Reference One',
    creators: ['Person A'],
    url: 'https://google.com'
  },
  {
    name: 'Reference Two',
    creators: ['Person B']
  }
  ])

  const { body, status } = await agent.get('/references').query({ text: 'google' })
  expect({ body, status }).toEqual({
    status: 200,
    body: {
      data: [{
        id: references[0]._id.toHexString(),
        name: references[0].name,
        creators: references[0].creators,
        url: references[0].url
      }]
    }
  })
})
