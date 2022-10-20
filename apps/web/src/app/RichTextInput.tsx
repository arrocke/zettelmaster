import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

export interface RichTextInputProps {
  text: any
  onTextChange?(text: any): void
}

const RichTextInput = ({ text, onTextChange }: RichTextInputProps) => {
  const editor = useEditor({
    content: text,
    extensions: [
      StarterKit,
    ],
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
    <EditorContent editor={editor} />
  )
}

export default RichTextInput