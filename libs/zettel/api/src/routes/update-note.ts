import { z } from 'zod'
import richTextSchema from '../rich-test-schema'
import {
  HTTPMethod,
  NotFoundError,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'
import { DocumentNode } from '@zettelmaster/rich-text'
import { NoteText } from '@zettelmaster/zettel/domain'
import { noteRepo } from '../db'

export interface UpdateNoteRequestBody {
  text?: DocumentNode
}

export default class UpdateNoteRoute extends Route<
  void,
  { noteId: string },
  UpdateNoteRequestBody,
  unknown
> {
  method = HTTPMethod.Patch
  path = '/notes/:noteId'

  protected async executeImpl(request: RouteRequest<{ noteId: string }, UpdateNoteRequestBody, unknown>): Promise<RouteResponse<void>> {
    const note = await noteRepo.findById(request.params.noteId)
    if (!note) {
      throw new NotFoundError('note')
    }

    let shouldSave = false

    if (request.body.text) {
      note.updateText(
        NoteText.createFromDocument(request.body.text)
      )
      shouldSave = true
    }

    if (shouldSave) {
      await noteRepo.commit(note)
    }

    return { statusCode: StatusCode.NoContent }
  }

  bodySchema = z.object({
    text: richTextSchema,
  })
  paramsSchema = z.object({ noteId: z.string() })
  querySchema = z.object({})
}


