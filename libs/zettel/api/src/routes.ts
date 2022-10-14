import express from 'express'
import CreateNoteRoute from './routes/create-note'

const router = express.Router()

new CreateNoteRoute().register(router)

export default router
