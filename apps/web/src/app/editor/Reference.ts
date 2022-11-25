import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import ReferenceNodeView from './ReferenceNodeView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    reference: {
      /**
       * Set a reference.
       */
      setReference: (attributes: { id: string }) => ReturnType,
    }
  }
}

const NoteLink = Node.create({
  name: 'reference',

  marks: '',
  group: 'inline',
  inline: true,

  addAttributes() {
    return {
      id: {},
      location: {}
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReferenceNodeView)
  },

  parseHTML() {
    return [
      { tag: 'reference' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['reference', mergeAttributes(HTMLAttributes)]
  },

  addCommands() {
    return {
      setReference: attributes => ({ commands }) => {
        return commands
          .setNode(this.name, attributes)
      }
    }
  },
})

export default NoteLink