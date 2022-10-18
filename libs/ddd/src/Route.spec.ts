import Route, { HTTPMethod, RouteRequest, RouteResponse, StatusCode } from './Route'
import { getMockReq, getMockRes } from '@jest-mock/express'
import * as z from 'zod'

describe('execute', () => {
  test('returns 400 if body validation fails', async () => {
    class TestRoute extends Route<
      void,
      Record<string, string>,
      string
    > {
      method = HTTPMethod.Post
      path = '/path'

      protected bodySchema = z.string()
      protected querySchema = z.object({})
      protected paramsSchema = z.object({})

      protected executeImpl(request: RouteRequest<Record<string, string>, string, unknown>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      body: 12
    })
    const { res } = getMockRes()

    new TestRoute().execute(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          code: 'InvalidRequest',
          message: 'could not understand request',
        },
      ],
    })
  })

  test('returns 400 if query validation fails', async () => {
    class TestRoute extends Route<
      void,
      Record<string, string>,
      unknown,
      { val: string }
    > {
      method = HTTPMethod.Post
      path = '/path'

      protected bodySchema = z.object({})
      protected querySchema = z.object({ val: z.string() })
      protected paramsSchema = z.object({})

      protected executeImpl(request: RouteRequest<Record<string, string>, unknown, { val: string }>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      query: {}
    })
    const { res } = getMockRes()

    new TestRoute().execute(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          code: 'InvalidRequest',
          message: 'could not understand request',
        },
      ],
    })
  })

  test('returns 400 if params validation fails', async () => {
    class TestRoute extends Route<
      void,
      { id: string }
    > {
      method = HTTPMethod.Post
      path = '/path'

      protected bodySchema = z.object({})
      protected querySchema = z.object({})
      protected paramsSchema = z.object({
        id: z.string()
      })

      protected executeImpl(request: RouteRequest<{ id: string }, unknown, unknown>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      params: {}
    })
    const { res } = getMockRes()

    new TestRoute().execute(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          code: 'InvalidRequest',
          message: 'could not understand request',
        },
      ],
    })
  })

  test.todo('returns response with body')
  test.todo('returns response with headers')
})

describe('register', () => {
  test.todo('registers as middleware in express router')
})