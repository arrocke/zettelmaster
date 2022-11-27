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

ReferenceSchema.index({ name: "text", creators: "text", url: "text" }, { default_language: 'none' })

export default model<DbReference>('Reference', ReferenceSchema)
