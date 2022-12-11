import { useCombobox } from 'downshift'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Editor, FloatingMenu } from '@tiptap/react'
import ReferenceSearch, { ReferenceSearchRef } from './ReferenceSearch'

interface Item {
  id: string
  name: string
}

export interface ReferenceSearchProps {
  editor: Editor
}

const ReferenceMenu = ({ editor }: ReferenceSearchProps) => {
  const searchRef = useRef<ReferenceSearchRef>(null)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    editor.storage['reference'].openReferenceSearch = () => {
      setShouldShow(true)
    }
  }, [editor])

  useEffect(() => {
    if (shouldShow) {
      searchRef.current?.focus()
    }
  }, [shouldShow])

  return <FloatingMenu
    editor={editor}
    shouldShow={() => true}
    tippyOptions={{
      placement: 'bottom',
      maxWidth: 400
    }}
  >
    {shouldShow ?
      <div
        className="bg-white rounded-lg border border-slate-300 text-slate-700 drop-shadow-md"
      >
        <ReferenceSearch
          ref={searchRef}
          editor={editor}
          onSelect={() => setShouldShow(false)}
          onCancel={() => {
            setShouldShow(false)
            editor.commands.focus()
          }}
        />
      </div> : null}
  </FloatingMenu>
}

export default ReferenceMenu
