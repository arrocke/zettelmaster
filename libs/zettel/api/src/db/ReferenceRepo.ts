import { Identifier } from '@zettelmaster/ddd'
import { Reference } from '@zettelmaster/zettel/domain'
import { isObjectIdOrHexString } from 'mongoose'
import ReferenceModel from './Reference'

export default class ReferenceRepo {
  async findById(id: string): Promise<Reference | undefined> {
    if (!isObjectIdOrHexString(id)) return
    const rawReference = await ReferenceModel.findById(id).lean()
    if (rawReference) {
      return new Reference(new Identifier(rawReference._id), {
        name: rawReference.name,
        creators: rawReference.creators,
        url: rawReference.url,
      })
    }
  }

  async commit(reference: Reference) {
    const id = reference.id._value
    const rawReference = {
      name: reference._data.name,
      creators: reference._data.creators,
      url: reference._data.url,
    }

    await ReferenceModel.updateOne(
      { _id: id },
      {
        $set: rawReference,
        $unset: {
          ...(!rawReference.url && { url: true }),
        },
        $setOnInsert: { _id: id },
      },
      { upsert: true }
    )
  }
}
