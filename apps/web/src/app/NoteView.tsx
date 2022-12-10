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
  references: {
    id: string
    name: string
    creators: string[]
    url?: string
  }[]
}

type MutateNoteData = Pick<NoteData, 'id' | 'text'>

export const NoteView = () => {
  const { noteId } = useParams()
  const { data } = useQuery<NoteData, unknown, NoteData, ['note', string | undefined]>(['note', noteId], async (key) => {
    if (key.queryKey[1]) {
      const res = await fetch(`/api/notes/${key.queryKey[1]}`)
      return res.json()
    }
  })

  const [hasChanges, setHasChanges] = useState(false)
  const queryClient = useQueryClient()
  const { mutate, isLoading, reset } = useMutation(
    async (data: MutateNoteData) => {
      await fetch(`/api/notes/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text })
      })
    },
    {
      onMutate: async (note) => {
        await queryClient.cancelQueries(['note', note.id])
        const prevNote = queryClient.getQueryData<MutateNoteData>(['note', note.id])
        queryClient.setQueryData(['note', note.id], {
          ...prevNote,
          ...note
        })
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
      <div className="flex-none p-2 border-b border-b-slate-400">
        <span>{hasChanges ? 'Unsaved changes' : 'Saved'}</span>
      </div>
      <RichTextInput
        className="flex-1 flex flex-col border-b border-b-slate-400"
        text={data.text}
        onTextChange={text => {
          setHasChanges(true)
          throttledMutate({ id: data.id, text })
        }}
      />
      <div className="h-1/5 p-4">
        <h2>References</h2>
        <ol className="pl-6 list-decimal">
          {data.references.map(reference => <li key={reference.id}>
            {
              reference.url
                ? <a href={reference.url} target="_blank" rel="noreferrer">{reference.name}</a>
                : reference.name
            }
          </li>)}
        </ol>
      </div>
    </div>
  } else {
    return null
  }
}

export default NoteView
