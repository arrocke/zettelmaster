import { mergeAttributes, Node } from '@tiptap/react'

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

  parseHTML() {
    return [
      { tag: 'span[data-type=reference]' },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': 'reference' },
        HTMLAttributes
      ),
      "[1, ",
      ['span', node.attrs['location'] ?? ""],
      "]"
    ]
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