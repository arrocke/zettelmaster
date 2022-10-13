import { Request, Response } from 'express'
import { DocumentNode, Note, NoteText } from '@zettelmaster/zettel/domain'
import { z } from 'zod'
import richTextSchema from '../rich-test-schema'
import { noteRepo } from '../db'

interface CreateNoteBody {
  text: DocumentNode
}

const createNoteBodySchema: z.ZodType<CreateNoteBody> = z.object({
  text: richTextSchema,
})

export default {
  method: 'post' as const,
  path: '/notes',
  handler: async (req: Request, res: Response) => {
    const parseResult = createNoteBodySchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(422).json({
        errors: [
          {
            code: 'InvalidRequest',
            message: 'could not understand request',
          },
        ],
      })
      return
    }
    const body = parseResult.data

    const note = Note.create({
      text: NoteText.createFromDocument(body.text),
    })

    await noteRepo.commit(note)

    res.set('location', `/notes/${note.id.value}`).status(201).end()
  },
}
