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
import { HydratedDocument } from 'mongoose'
import { DbReference } from '../db/Reference'

export interface GetNoteResponseBody {
  id: string
  text: DocumentNode
  references: {
    id: string
    name: string
    creators: string[]
    url?: string
  }[]
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
    const note = await NoteModel.findById(request.params.noteId).populate<{ references: HydratedDocument<DbReference>[] }>('references')
    if (!note) {
      throw new NotFoundError('note')
    }

    return {
      body: {
        id: note._id.toHexString(),
        text: note.text,
        references: note.references.map(reference => ({
          id: reference._id?.toHexString(),
          name: reference.name,
          creators: reference.creators,
          url: reference.url
        }))
      },
      statusCode: StatusCode.Ok
    }
  }

  parseBody = z.object({}).parse
  parseParams = z.object({ noteId: z.string() }).parse
  parseQuery = z.object({}).parse
}

