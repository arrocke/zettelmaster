import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

export interface RichTextInputProps {
  text: any
  onTextChange?(text: any): void
  className?: string
}

const RichTextInput = ({ className = '', text, onTextChange }: RichTextInputProps) => {
  const editor = useEditor({
    content: text,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node, pos }) => {
          return node.type.name === 'paragraph' && pos === 0 ? 'Click to start typing' : ''
        },
        emptyNodeClass: 'before:text-slate-500 before:float-left before:h-0 before:pointer-events-none before:content-[attr(data-placeholder)]'
      })
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none p-4 h-full'
      }
    },
    onUpdate({ editor }) {
      onTextChange?.(editor.getJSON())
    },
  })

  useEffect(() => {
    if (editor && JSON.stringify(text) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(text)
    }
  }, [text, editor])

  return (
    <div className={className}>
      <EditorContent className="h-full" editor={editor} />
    </div>
  )
}

export default RichTextInput