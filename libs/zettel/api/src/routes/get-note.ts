import { z } from 'zod'
import {
  HTTPMethod,
  NotFoundError,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'
import { DocumentNode } from '@zettelmaster/rich-text'
import NoteModel from '../db/Note'

export interface GetNoteResponseBody {
  id: string
  text: DocumentNode
}

export default class GetNoteRoute extends Route<
  GetNoteResponseBody,
  { noteId: string },
  unknown,
  unknown
> {
  method = HTTPMethod.Get
  path = '/notes/:noteId'

  protected async executeImpl(request: RouteRequest<{ noteId: string }, unknown, unknown>): Promise<RouteResponse<GetNoteResponseBody>> {
    const note = await NoteModel.findById(request.params.noteId)
    if (!note) {
      throw new NotFoundError('note')
    }

    return {
      body: {
        id: note._id.toHexString(),
        text: note.text
      },
      statusCode: StatusCode.Ok
    }
  }

  bodySchema = z.object({})
  paramsSchema = z.object({ noteId: z.string() })
  querySchema = z.object({})
}

