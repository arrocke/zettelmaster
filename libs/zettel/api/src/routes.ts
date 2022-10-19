import express from 'express'
import CreateNoteRoute from './routes/create-note'
import GetNoteRoute from './routes/get-note'

const router = express.Router()

new CreateNoteRoute().register(router)
new GetNoteRoute().register(router)

export default router
