import express from 'express'
import { routes as zettelRoutes } from '@zettelmaster/zettel/api'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI missing')
}
mongoose.connect(process.env.MONGODB_URI)

const app = express()

app.use(bodyParser.json())
app.use('/', (req, res, next) => {
  console.log(req.method, req.path)
  if (req.url.startsWith('/api')) {
    req.url = req.url.slice(4)
  }
  next()
})

app.use('/', zettelRoutes)

const port = process.env.port || 3333
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port)
})
server.on('error', console.error)
