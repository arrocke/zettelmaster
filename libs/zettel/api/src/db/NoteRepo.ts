import { Identifier } from '@zettelmaster/ddd'
import { Note, NoteText } from '@zettelmaster/zettel/domain'
import { isObjectIdOrHexString } from 'mongoose'
import NoteModel from './Note'

export default class NoteRepo {
  async findById(id: string): Promise<Note | undefined> {
    if (!isObjectIdOrHexString(id)) return
    const rawNote = await NoteModel.findById(id).lean()
    if (rawNote) {
      return new Note(new Identifier(rawNote._id), {
        text: new NoteText({
          document: rawNote.text,
          links: rawNote.links.map((link) => new Identifier(link)),
          references: rawNote.references.map((link) => new Identifier(link)),
        }),
      })
    }
  }

  async commit(note: Note) {
    const noteText = note._data.text
    const id = note.id._value
    const rawNote = {
      text: noteText._data.document,
      links: noteText._data.links.map((link) => link._value),
      references: noteText._data.references.map(
        (reference) => reference._value
      ),
    }

    await NoteModel.updateOne(
      { _id: id },
      {
        $set: rawNote,
        $setOnInsert: { _id: id },
      },
      { upsert: true }
    )
  }
}
