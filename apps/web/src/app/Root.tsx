import { Outlet, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import NoteList from './NoteList'
import { Icon } from './Icon'

const Root = () => {
  const navigate = useNavigate()
  const createNote = useMutation(async () => {
    const res = await fetch('/api/notes', {
      method: 'POST'
    })
    return res.headers.get('location')!.split('/').slice(-1)[0]
  }, {
    onSuccess: (noteId) => {
      navigate(`/notes/${noteId}`)
    }
  })

  return (
    <div className="h-screen w-screen flex items-stretch">
      <div className="flex flex-col border-r border-r-slate-400">
        <button
          className="p-2 text-left"
          disabled={createNote.isLoading}
          onClick={() => createNote.mutate()}
        >
          <Icon type="plus" />{" "}
          Create Note
        </button>
        <NoteList className="flex-grow flex-shrink-0 w-72" />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div >
  )
}

export default Root

