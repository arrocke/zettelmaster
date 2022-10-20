import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RichTextInput from './RichTextInput'
import { useMemo } from 'react'
import { throttle } from 'lodash'

export const NoteView = () => {
  const queryClient = useQueryClient()
  const { noteId } = useParams()
  const { data } = useQuery(['note', noteId], async (key) => {
    const res = await fetch(`/api/notes/${noteId}`)
    return res.json()
  })

  const { mutate, isLoading } = useMutation((data: any) =>
    fetch(`/api/notes/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: data.text
      })
    }), {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['note', variables.id])
    }
  }
  )

  const throttledMutate = useMemo(() => throttle(mutate, 5000, {
    trailing: true,
    leading: false
  }), [mutate])

  async function onTextChange(text: any) {
    await throttledMutate({ id: noteId, text })
  }

  if (data) {
    return <div className="h-full flex flex-col">
      <div className="flex-none">
        <span>{data.id}</span>
        <span>{isLoading ? 'Saving...' : 'Saved'}</span>
      </div>
      <RichTextInput className="flex-1" text={data.text} onTextChange={onTextChange} />
    </div>
  } else {
    return null
  }
}

export default NoteView
