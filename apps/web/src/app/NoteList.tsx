import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from 'react-router-dom'

export interface NoteListProps {
  className?: string
}

interface NoteData {
  id: string
  preview: string
}

const NoteList = ({ className = '' }: NoteListProps) => {
  const [searchText, setSearch] = useState('')
  const { data } = useQuery<NoteData[], unknown, NoteData[], ['notes', string]>(['notes', searchText], async (key) => {
    const url = new URL('/api/notes', window.location.href)
    url.searchParams.append('limit', '20')
    if (key.queryKey[1]) {
      url.searchParams.append('text', key.queryKey[1])
    }
    console.log(url.toString())
    const response = await fetch(url.toString())
    if (response.status === 200) {
      const { data } = await response.json()
      return data
    } else {
      return []
    }
  })

  return <div className={`${className}`}>
    <input
      className="border-b border-t border-slate-400 p-2 w-full"
      placeholder="Search notes..."
      value={searchText}
      onChange={e => setSearch(e.target.value)}
    />
    <ul>
      {
        data?.map(note => <li key={note.id} className="border-b border-slate-400">
          <Link className="block p-2" to={`/notes/${note.id}`}>{note.preview || 'Empty Note'}</Link>
        </li>)
      }
    </ul>
  </div>
}

export default NoteList