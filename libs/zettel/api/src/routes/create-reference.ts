import { Reference } from '@zettelmaster/zettel/domain'
import { z } from 'zod'
import { referenceRepo } from '../db'
import {
  HTTPMethod,
  Route,
  RouteRequest,
  RouteResponse,
  StatusCode,
} from '@zettelmaster/ddd'

interface CreateReferenceBody {
  name: string
}

export default class CreateReferenceRoute extends Route<
  void,
  unknown,
  CreateReferenceBody,
  unknown
> {
  method = HTTPMethod.Post
  path = '/references'

  async executeImpl({
    body,
  }: RouteRequest<unknown, CreateReferenceBody, unknown>): Promise<
    RouteResponse<void>
  > {
    const reference = Reference.create({
      name: body.name,
      creators: []
    })

    await referenceRepo.commit(reference)

    return {
      statusCode: StatusCode.Created,
      headers: {
        location: `/references/${reference.id.value}`,
      },
    }
  }

  parseBody = z.object({
    name: z.string(),
  }).parse
  parseParams = z.object({}).parse
  parseQuery = z.object({}).parse
}
