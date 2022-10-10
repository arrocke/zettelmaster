import { model, Schema } from 'mongoose'

export interface DbReference {
  name: string
  creators: string[]
  url?: string
}

const ReferenceSchema = new Schema({
  name: String,
  creators: [String],
  url: String,
})

export default model<DbReference>('Reference', ReferenceSchema)
