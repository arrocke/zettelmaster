import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RichTextInput from './editor/RichTextInput'
import { useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'lodash'
import useUnloadWarning from './useUnloadWarning'

export const NoteView = () => {
  const queryClient = useQueryClient()
  const { noteId } = useParams()
  const { data } = useQuery(['note', noteId], async (key) => {
    const res = await fetch(`/api/notes/${noteId}`)
    return res.json()
  })

  const { mutate, isLoading } = useMutation(
    (data: any) =>
      fetch(`/api/notes/${data.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: data.text
        })
      }),
    {
      onMutate: () => setHasChanges(false),
      onError: () => setHasChanges(true),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['note', variables.id])
      }
    }
  )

  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout | undefined>()
  useEffect(() => {
    if (isSaving !== isLoading) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
      if (isLoading) {
        setSaving(true)
      } else {
        timeoutId.current = setTimeout(() => setSaving(false), 2000)
      }
    }
  }, [isLoading, isSaving])

  const throttledMutate = useMemo(() => throttle(mutate, 5000, {
    trailing: true,
    leading: false
  }), [mutate])

  async function onTextChange(text: any) {
    setHasChanges(true)
    await throttledMutate({ id: noteId, text })
  }

  useUnloadWarning(hasChanges || isLoading)

  if (data) {
    return <div className="h-full flex flex-col">
      <div className="flex-none">
        <span>{isSaving ? 'Saving...' : hasChanges ? 'Unsaved changes' : 'Saved'}</span>
      </div>
      <hr />
      <RichTextInput className="flex-1" text={data.text} onTextChange={onTextChange} />
    </div>
  } else {
    return null
  }
}

export default NoteView
