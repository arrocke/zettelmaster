import { useParams } from 'react-router-dom'
import { DocumentNode } from '@zettelmaster/rich-text'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RichTextInput from './editor/RichTextInput'
import { useEffect, useMemo, useState } from 'react'
import { throttle } from 'lodash'
import useUnloadWarning from './useUnloadWarning'

interface NoteData {
  id: string,
  text: DocumentNode
}

export const NoteView = () => {
  const { noteId } = useParams()
  const { data } = useQuery<NoteData>(['note', noteId], async (key) => {
    if (noteId) {
      const res = await fetch(`/api/notes/${noteId}`)
      return res.json()
    }
  })

  const [hasChanges, setHasChanges] = useState(false)
  const queryClient = useQueryClient()
  const { mutate, isLoading, reset } = useMutation(
    async (data: NoteData) => {
      await fetch(`/api/notes/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text })
      })
    },
    {
      onMutate: async (note) => {
        await queryClient.cancelQueries(['note', note.id])
        const prevNote = queryClient.getQueryData<NoteData>(['note', note.id])
        queryClient.setQueryData(['note', note.id], note)
        return { prevNote }
      },
      onSuccess: (response, note) => {
        setHasChanges(false)
      },
      onError: (error, note, context) => {
        queryClient.setQueryData(['note', note.id], context?.prevNote)
      },
      onSettled: (response, error, note) => {
        queryClient.invalidateQueries(['note', note.id])
      }
    }
  )

  // We don't want to save on every keystroke, so we throttle to once every 5 seconds.
  const throttledMutate = useMemo(() => throttle(mutate, 5000, {
    trailing: true,
    leading: false
  }), [mutate])
  // When this page navigates away or to a new note,
  // we need to flush the throttled function so that the latest changes are saved.
  // and then reset the mutation state for the new page.
  useEffect(() => {
    return () => {
      throttledMutate.flush()
      reset()
      setHasChanges(false)
    }
  }, [throttledMutate, reset, noteId])

  useUnloadWarning(hasChanges || isLoading)

  if (data) {
    return <div className="h-full flex flex-col">
      <div className="flex-none">
        <span>{hasChanges ? 'Unsaved changes' : 'Saved'}</span>
      </div>
      <hr />
      <RichTextInput
        className="flex-1"
        text={data.text}
        onTextChange={text => {
          setHasChanges(true)
          throttledMutate({ id: data.id, text })
        }}
      />
    </div>
  } else {
    return null
  }
}

export default NoteView
