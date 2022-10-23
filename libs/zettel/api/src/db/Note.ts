import { DocumentNode } from '@zettelmaster/rich-text'
import { model, Schema, Types } from 'mongoose'

export interface DbNote {
  text: DocumentNode
  links: Types.ObjectId[]
  references: Types.ObjectId[]
  searchString: string
}

const NoteSchema = new Schema({
  text: Object,
  links: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  references: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reference',
    },
  ],
  searchString: String
})

NoteSchema.index({ searchString: "text" })

export default model<DbNote>('Note', NoteSchema)
