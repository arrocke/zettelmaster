import { useParams } from 'react-router-dom'

export const NoteView = () => {
  const { noteId } = useParams()
  return (
    <>
      {noteId}
    </>
  )
}

export default NoteView
