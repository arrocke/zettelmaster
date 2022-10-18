import { DocumentNode, Note, NoteText } from '@zettelmaster/zettel/domain'
import { z } from 'zod'
import richTextSchema from '../rich-test-schema'
import { noteRepo } from '../db'
import {
  HTTPMethod,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'

interface CreateNoteBody {
  text: DocumentNode
}

export default class CreateNoteRoute extends Route<
  void,
  unknown,
  CreateNoteBody,
  unknown
> {
  method = HTTPMethod.Post
  path = '/notes'

  async executeImpl({
    body,
  }: RouteRequest<unknown, CreateNoteBody, unknown>): Promise<
    RouteResponse<void>
  > {
    const note = Note.create({
      text: NoteText.createFromDocument(body.text),
    })

    await noteRepo.commit(note)

    return {
      statusCode: StatusCode.Created,
      headers: {
        location: `/notes/${note.id.value}`,
      },
    }
  }

  bodySchema = z.object({
    text: richTextSchema,
  })
  paramsSchema = z.object({})
  querySchema = z.object({})
}
