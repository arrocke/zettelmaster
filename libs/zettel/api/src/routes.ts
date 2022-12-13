import express from 'express'
import CreateNoteRoute from './routes/create-note'
import CreateReferenceRoute from './routes/create-reference'
import GetNoteRoute from './routes/get-note'
import SearchNotesRoute from './routes/search-notes'
import SearchReferencesRoute from './routes/search-references'
import UpdateNoteRoute from './routes/update-note'

const router = express.Router()

new SearchNotesRoute().register(router)
new CreateNoteRoute().register(router)
new GetNoteRoute().register(router)
new UpdateNoteRoute().register(router)

new SearchReferencesRoute().register(router)
new CreateReferenceRoute().register(router)

export default router
