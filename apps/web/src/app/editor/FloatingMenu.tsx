import { Editor, FloatingMenu as BaseFloatingMenu } from '@tiptap/react'
import { useEffect, useRef } from 'react'
import ReferenceSearch, { ReferenceSearchRef } from './ReferenceSearch'

export interface FloatingMenuProps {
  editor: Editor
}

const FloatingMenu = ({ editor }: FloatingMenuProps) => {
  const referenceSearch = useRef<ReferenceSearchRef>(null)
  const shouldShowRef = useRef(false)

  useEffect(() => {
    editor.storage['reference'].openReferenceSearch = () => {
      shouldShowRef.current = true
    }
  }, [editor])

  return <BaseFloatingMenu
    editor={editor}
    shouldShow={() => shouldShowRef.current}
    className="bg-white rounded-lg border border-slate-300 text-slate-700 drop-shadow-md"
    tippyOptions={{
      placement: 'bottom',
      maxWidth: 400,
      onShown() {
        referenceSearch.current?.focus()
      }
    }}
  >
    <ReferenceSearch
      ref={referenceSearch}
      editor={editor}
      onSelect={() => shouldShowRef.current = false}
      onBlur={() => shouldShowRef.current = false}
    />
  </BaseFloatingMenu>
}

export default FloatingMenu