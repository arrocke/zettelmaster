import { DocumentNode } from '@zettelmaster/zettel/domain'
import { model, Schema, Types } from 'mongoose'

export interface DbNote {
  text: DocumentNode
  links: Types.ObjectId[]
  references: Types.ObjectId[]
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
})

export default model<DbNote>('Note', NoteSchema)
