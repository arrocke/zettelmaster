import express from 'express'
import { routes as zettelRoutes } from '@zettelmaster/zettel/api'

const app = express()

app.use('/', zettelRoutes)

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api')
})
server.on('error', console.error)
