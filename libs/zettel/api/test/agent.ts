import express from 'express'
import supertest from 'supertest'
import routes from '../src/routes'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.use('/', routes)

const agent = supertest.agent(app)
export default agent
