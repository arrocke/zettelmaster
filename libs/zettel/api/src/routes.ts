import express from 'express'
import CreateNoteRoute from './routes/create-note'
import GetNoteRoute from './routes/get-note'
import SearchNotesRoute from './routes/search-notes'
import UpdateNoteRoute from './routes/update-note'

const router = express.Router()

new SearchNotesRoute().register(router)
new CreateNoteRoute().register(router)
new GetNoteRoute().register(router)
new UpdateNoteRoute().register(router)

export default router
