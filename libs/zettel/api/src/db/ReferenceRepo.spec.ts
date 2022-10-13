import { Identifier } from '@zettelmaster/ddd'
import { Reference } from '@zettelmaster/zettel/domain'
import { ObjectId } from 'mongodb'
import ReferenceRepo from './ReferenceRepo'
import ReferenceModel from './Reference'
import '../../test/connect-db'

const repo = new ReferenceRepo()

describe('findById', () => {
  test('returns a Reference for a found document', async () => {
    const reference = new Reference(Identifier.generate(), {
      name: 'first reference',
      creators: ['dumb', 'dumber'],
      url: 'https://google.com',
    })
    await ReferenceModel.insertMany([
      {
        _id: reference.id._value,
        name: reference._data.name,
        creators: reference._data.creators,
        url: reference._data.url,
      },
    ])
    await expect(repo.findById(reference.id.value)).resolves.toEqual(reference)
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
    const reference = new Reference(Identifier.generate(), {
      name: 'first reference',
      creators: ['dumb', 'dumber'],
      url: 'https://google.com',
    })
    await repo.commit(reference)
    const dbReference = await ReferenceModel.findById(
      reference.id._value
    ).lean()
    expect(dbReference).toEqual({
      _id: reference.id._value,
      name: reference._data.name,
      creators: reference._data.creators,
      url: reference._data.url,
      __v: 0,
    })
  })

  test('updates existing document when one is found', async () => {
    const reference = new Reference(Identifier.generate(), {
      name: 'first reference',
      creators: ['dumb', 'dumber'],
    })
    await ReferenceModel.insertMany([
      {
        _id: reference.id._value,
        name: 'previous name',
        creators: ['sally'],
        url: 'https://google.com',
      },
    ])
    await repo.commit(reference)
    const dbReference = await ReferenceModel.findById(
      reference.id._value
    ).lean()
    expect(dbReference).toEqual({
      _id: reference.id._value,
      name: reference._data.name,
      creators: reference._data.creators,
      url: reference._data.url,
      __v: 0,
    })
  })
})
