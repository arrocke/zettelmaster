import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NoteLink from './NoteLink'
import Reference from './Reference'
import RichTextMenu from './RichTextMenu'
import ReferenceMenu from './ReferenceMenu'

export interface RichTextInputProps {
  text: any
  onTextChange?(text: any): void
  className?: string
}

const RichTextInput = ({ className = '', text, onTextChange }: RichTextInputProps) => {
  const navigate = useNavigate()

  const editor = useEditor({
    content: text,
    extensions: [
      StarterKit,
      NoteLink.configure({
        onClick(href) {
          navigate(href)
        }
      }),
      Reference.configure(),
      Placeholder.configure({
        placeholder: ({ node, pos, editor }) => {
          return node.type.name === 'paragraph' && pos === 0 && !editor.isFocused ? 'Click to start typing' : ''
        },
        emptyNodeClass: 'before:text-slate-500 before:float-left before:h-0 before:pointer-events-none before:content-[attr(data-placeholder)]'
      })
    ],
    editorProps: {
      attributes: {
        tabindex: '0',
        class: 'focus:outline-none p-4 h-full'
      }
    },
    onUpdate({ editor }) {
      onTextChange?.(editor.getJSON())
    }
  })

  useEffect(() => {
    if (editor && JSON.stringify(text) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(text)
    }
  }, [text, editor])



  return (
    <div className={className}>
      <EditorContent className="h-full" editor={editor} />
      {editor && <RichTextMenu editor={editor} />}
      {editor && <ReferenceMenu editor={editor} />}
    </div>
  )
}

export default RichTextInput