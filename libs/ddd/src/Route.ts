import express from 'express'
import { z } from 'zod'
import { NotFoundError } from './errors'

export enum StatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  Redirect = 302,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Invalid = 422,
}

export enum HTTPMethod {
  Get = 'get',
  Post = 'post',
  Patch = 'patch',
  Put = 'put',
  Delete = 'delete',
}

export interface RouteRequest<Params, Body, Query> {
  params: Params
  body: Body
  query: Query
  originalRequest: express.Request
}

export type RouteResponse<Body> = Body extends void
  ? {
    headers?: { [key: string]: string }
    statusCode: StatusCode
  }
  : {
    body: Body
    headers?: { [key: string]: string }
    statusCode: StatusCode
  }

/** Occurs when validation on route body, query, or params fails. */
class InvalidRequestError extends Error {
  constructor() {
    super('could not understand request')
  }
}

const statusCodeMap: Record<string, StatusCode> = {
  [InvalidRequestError.name]: StatusCode.BadRequest,
  [NotFoundError.name]: StatusCode.NotFound
}

function convertErrorToHttpError(error: Error) {
  return {
    code: error.constructor.name.replace(/Error$/, '') || 'Unknown',
    message: error.message
  }
}

/**
 * Base implementation of a HTTP route.
 * Ensures that the request and response conform to the expected typescript types,
 * and handles errors in the route implementation.
 */
export default abstract class Route<
  Response = void,
  Params = { [key: string]: string },
  Body = unknown,
  Query = unknown
> {
  constructor() {
    this.execute = this.execute.bind(this)
  }

  /**
   * Execute the route as express middleware.
   * @param req Request from express middleware.
   * @param res Response from express middleware.
   */
  async execute(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { body, query, params } = this.validateRequest(req)

      const response = await this.executeImpl({
        body,
        query,
        params,
        originalRequest: req,
      })

      if (response.headers) {
        res.set(response.headers)
      }
      res.status(response.statusCode)
      if ('body' in response && response.body) {
        res.json(response.body)
      } else {
        res.send()
      }
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(statusCodeMap[error.constructor.name] ?? StatusCode.BadRequest)
          .json({
            errors: [convertErrorToHttpError(error)]
          })
      }
    }
  }

  /**
   * Register the route on an express router or application.
   * @param router The express router or application to register the route with.
   */
  register(router: express.IRouter) {
    router[this.method](this.path, this.execute)
  }

  /** The HTTP method of the route. */
  protected abstract method: HTTPMethod
  /** The path of the route. Uses express routing syntax. */
  protected abstract path: string

  /**
   * The implementation of the route.
   * Only executed if validation of the request passes.
   * Thrown errors are caught and returned as the appropriate error code.
   * @param request The parsed request data.
   */
  protected abstract executeImpl(
    request: RouteRequest<Params, Body, Query>
  ): Promise<RouteResponse<Response>>

  /** Validation schema for the request body. */
  protected abstract bodySchema: z.ZodType<Body>
  /** Validation schema for the request query. */
  protected abstract querySchema: z.ZodType<Query>
  /** Validation schema for the request params. */
  protected abstract paramsSchema: z.ZodType<Params>

  /** Validate the request to match the typescript types of the Route. */
  protected validateRequest(req: express.Request): {
    body: Body
    query: Query
    params: Params
  } {
    try {
      const body = this.bodySchema.parse(req.body ?? {})

      const query = this.querySchema.parse(req.query ?? {})

      const params = this.paramsSchema.parse(req.params ?? {})

      return { body, query, params }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new InvalidRequestError()
      } else {
        throw error
      }
    }
  }
}
