import { useEffect, useRef, KeyboardEvent, MouseEvent } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'

const ReferenceNodeView = ({ selected, editor, getPos, node, updateAttributes }: NodeViewProps) => {
  const locationInput = useRef<HTMLInputElement>(null)
  const measureElement = useRef<HTMLSpanElement>(null)

  const location = node.attrs['location']
  useEffect(() => {
    if (measureElement.current && locationInput.current) {
      locationInput.current.style.width = `${Math.max(1, measureElement.current.clientWidth)}px`
    }
  }, [location])

  useEffect(() => {
    if (selected) {
      locationInput.current?.focus()
    }
  }, [selected])

  useEffect(() => {
    const handler = ({ editor }: any) => {
      if (locationInput.current) {
        if (editor.state.selection.$anchor.pos > getPos()) {
          const newPos = locationInput.current.value.length
          locationInput.current.setSelectionRange(newPos, newPos)
        } else if (editor.state.selection.$anchor.pos < getPos()) {
          locationInput.current.setSelectionRange(0, 0)
        }
      }
    }
    editor.on('selectionUpdate', handler)
    return () => { editor.off('selectionUpdate', handler) }
  }, [editor, getPos])

  function onClick(e: MouseEvent<HTMLSpanElement>) {
    editor.commands.setNodeSelection(getPos())
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const input = locationInput.current
    if (!input) return
    switch (e.key) {
      case 'Tab': {
        e.preventDefault()
        break
      }
      case 'ArrowRight': {
        if (input.selectionEnd === input.selectionStart && input.selectionEnd === input.value.length) {
          e.preventDefault()
          editor.chain().focus().setTextSelection(getPos() + 1).run()
        }
        break
      }
      case 'ArrowLeft': {
        if (input.selectionEnd === input.selectionStart && input.selectionEnd === 0) {
          e.preventDefault()
          editor.chain().focus().setTextSelection(getPos()).run()
        }
        break
      }
    }
  }

  return (
    <NodeViewWrapper
      as="span"
      onClick={onClick}
    >
      {"[1, "}
      <input
        ref={locationInput}
        className="focus:outline-none bg-transparent"
        onKeyDown={onKeyDown}
        tabIndex={-1}
        value={location}
        onChange={e => updateAttributes({ location: e.target.value })}
      />
      ]
      <span ref={measureElement} className="absolute invisible">{node.attrs['location']}</span>
    </NodeViewWrapper>
  )
}

export default ReferenceNodeView