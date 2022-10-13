import express, { RequestHandler } from 'express'
import createNote from './routes/create-note'

const routes = express.Router()

function initRoute(route: {
  method: 'get' | 'post' | 'patch' | 'put' | 'delete'
  path: string
  handler: RequestHandler
}) {
  routes[route.method](route.path, route.handler)
}

initRoute(createNote)

export default routes
