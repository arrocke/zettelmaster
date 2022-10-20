import { z } from 'zod'
import {
  HTTPMethod,
  NotFoundError,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'
import NoteModel from '../db/Note'

export interface SearchNotesResponseBody {
  data: {
    id: string
  }[]
}

export default class SearchNotesRoute extends Route<
  SearchNotesResponseBody,
  unknown,
  unknown,
  unknown
> {
  method = HTTPMethod.Get
  path = '/notes'

  protected async executeImpl(request: RouteRequest<unknown, unknown, unknown>): Promise<RouteResponse<SearchNotesResponseBody>> {
    const notes = await NoteModel.find({}, { _id: true })

    return {
      body: {
        data: notes.map(note => ({
          id: note._id.toHexString()
        }))
      },
      statusCode: StatusCode.Ok
    }
  }

  bodySchema = z.object({})
  paramsSchema = z.object({})
  querySchema = z.object({})
}


