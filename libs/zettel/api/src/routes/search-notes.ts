import { z } from 'zod'
import { FilterQuery } from 'mongoose'
import {
  HTTPMethod,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'
import NoteModel, { DbNote } from '../db/Note'

export interface SearchNotesResponseBody {
  data: {
    id: string,
    preview: string
  }[]
}

export interface SearchNotesQuery {
  text?: string
}

export default class SearchNotesRoute extends Route<
  SearchNotesResponseBody,
  unknown,
  unknown,
  SearchNotesQuery
> {
  method = HTTPMethod.Get
  path = '/notes'

  protected async executeImpl(request: RouteRequest<unknown, unknown, SearchNotesQuery>): Promise<RouteResponse<SearchNotesResponseBody>> {
    const options: FilterQuery<DbNote> = {}

    if (request.query.text) {
      options.$text = {
        $search: request.query.text
      }
    }

    const notes = await NoteModel.find(options, { _id: true, searchString: true })

    return {
      body: {
        data: notes.map(note => ({
          id: note._id.toHexString(),
          preview: note.searchString.slice(0, 100)
        }))
      },
      statusCode: StatusCode.Ok
    }
  }

  bodySchema = z.object({})
  paramsSchema = z.object({})
  querySchema = z.object({
    text: z.string().optional()
  })
}


