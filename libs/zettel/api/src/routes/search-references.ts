import { z } from 'zod'
import { FilterQuery } from 'mongoose'
import {
  HTTPMethod,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'
import ReferenceModel, { DbReference } from '../db/Reference'

export interface SearchReferenceResponseBody {
  data: {
    id: string,
    name: string,
    creators: string[],
    url?: string
  }[]
}

export interface SearchReferencesQuery {
  text?: string
  limit?: number
}

const parseQuery = z.object({
  text: z.string().optional(),
  limit: z.preprocess(
    x => {
      const result = z.string().optional().transform(Number).safeParse(x)
      return result.success ? result.data : null
    },
    z.number().optional()
  )
})

type x = z.infer<typeof parseQuery>

export default class SearchReferencesRoute extends Route<
  SearchReferenceResponseBody,
  unknown,
  unknown,
  SearchReferencesQuery
> {
  method = HTTPMethod.Get
  path = '/references'

  protected async executeImpl(request: RouteRequest<unknown, unknown, SearchReferencesQuery>): Promise<RouteResponse<SearchReferenceResponseBody>> {
    const options: FilterQuery<DbReference> = {}

    if (request.query.text) {
      options.$text = {
        $search: request.query.text
      }
    }

    const references = await ReferenceModel.find(options, { _id: true, creators: true, name: true, url: true }).limit(request.query.limit ?? 5)

    return {
      body: {
        data: references.map(reference => ({
          id: reference._id.toHexString(),
          name: reference.name,
          creators: reference.creators,
          url: reference.url
        }))
      },
      statusCode: StatusCode.Ok
    }
  }

  parseBody = z.object({}).parse
  parseParams = z.object({}).parse
  parseQuery = z.object({
    text: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  }).parse
}



