import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { Icon } from '../Icon'
import NoteLink from './NoteLink'

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
      NoteLink,
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
      {editor && (
        <BubbleMenu
          className="bg-white rounded-lg border border-slate-300 text-slate-700 drop-shadow-md"
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`
              w-8 h-8 rounded-l-lg
              focus:bg-slate-300 hover:bg-slate-300
              ${editor.isActive('bold') ? 'text-blue-500' : ''}
            `}
            tabIndex={-1}
          >
            <Icon type="bold" />
            <span className="sr-only">Bold</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`
              w-8 h-8
              focus:bg-slate-300 hover:bg-slate-300
              ${editor.isActive('italic') ? 'text-blue-500' : ''}
            `}
            tabIndex={-1}
          >
            <Icon type="italic" />
            <span className="sr-only">Italic</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`
              w-8 h-8
              focus:bg-slate-300 hover:bg-slate-300
              ${editor.isActive('strike') ? 'text-blue-500' : ''}
            `}
            tabIndex={-1}
          >
            <Icon type="strike" />
            <span className="sr-only">Strikethrough</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`
              w-8 h-8 rounded-r-lg
              focus:bg-slate-300 hover:bg-slate-300
              ${editor.isActive('strike') ? 'text-blue-500' : ''}
            `}
            tabIndex={-1}
          >
            <Icon type="code" />
            <span className="sr-only">Code</span>
          </button>
        </BubbleMenu>
      )}
    </div>
  )
}

export default RichTextInput