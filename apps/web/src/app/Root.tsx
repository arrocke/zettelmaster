import { Outlet, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

export const Root = () => {
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
    <>
      <div>
        <button
          disabled={createNote.isLoading}
          onClick={() => createNote.mutate()}
        >
          Create Note
        </button>
      </div>
      <Outlet />
    </>
  )
}

export default Root

