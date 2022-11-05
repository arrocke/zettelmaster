import Route, { HTTPMethod, RouteRequest, RouteResponse, StatusCode } from './Route'
import { IRouter } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { NotFoundError } from './errors'
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

      protected parseBody = z.string().parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<Record<string, string>, string, unknown>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      body: 12
    })
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
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

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({ val: z.string() }).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<Record<string, string>, unknown, { val: string }>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      query: {}
    })
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
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

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({
        id: z.string()
      }).parse

      protected executeImpl(request: RouteRequest<{ id: string }, unknown, unknown>): Promise<RouteResponse<void>> {
        throw new Error('not implemented')
      }
    }

    const req = getMockReq({
      params: {}
    })
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
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

  test('returns 404 when a NotFoundError is thrown', async () => {
    class TestRoute extends Route {
      method = HTTPMethod.Post
      path = '/path'

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<unknown, unknown, unknown>): Promise<RouteResponse<void>> {
        throw new NotFoundError('user')
      }
    }

    const req = getMockReq()
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          code: 'NotFound',
          message: 'User not found.',
        },
      ],
    })
  })

  test('returns response with body', async () => {
    class TestRoute extends Route<
      { val: string }
    > {
      method = HTTPMethod.Post
      path = '/path'

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<{ id: string }, unknown, unknown>): Promise<RouteResponse<{ val: string }>> {
        return Promise.resolve({
          body: { val: 'hello' },
          statusCode: StatusCode.Ok
        })
      }
    }

    const req = getMockReq({
      body: {},
      query: {},
      params: {}
    })
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ val: 'hello' })
  })

  test('returns response with headers', async () => {
    class TestRoute extends Route {
      method = HTTPMethod.Post
      path = '/path'

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<{ id: string }, unknown, unknown>): Promise<RouteResponse<void>> {
        return Promise.resolve({
          statusCode: StatusCode.Created,
          headers: {
            location: '/path/1234'
          }
        })
      }
    }

    const req = getMockReq({
      body: {},
      query: {},
      params: {}
    })
    const { res } = getMockRes()

    await new TestRoute().execute(req, res)
    expect(res.set).toHaveBeenCalledWith({
      location: '/path/1234'
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalled()
  })
})

describe('register', () => {
  test('registers as middleware in express router', async () => {
    class TestRoute extends Route<
      { val: string }
    > {
      method = HTTPMethod.Get
      path = '/path'

      protected parseBody = z.object({}).parse
      protected parseQuery = z.object({}).parse
      protected parseParams = z.object({}).parse

      protected executeImpl(request: RouteRequest<{ id: string }, unknown, unknown>): Promise<RouteResponse<{ val: string }>> {
        return Promise.resolve({
          body: { val: 'hello' },
          statusCode: StatusCode.Ok
        })
      }
    }

    const routerMock = {
      get: jest.fn()
    } as unknown as IRouter

    const route = new TestRoute()
    route.register(routerMock)

    expect(routerMock[route.method]).toHaveBeenCalledWith(route.path, route.execute)
  })
})