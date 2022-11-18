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

// TODO: figure out how to get text after reference.
// TODO: figure out to set text selection after node.

const NoteLink = Node.create({
  name: 'reference',

  content: 'text*',
  marks: '',
  group: 'inline',
  inline: true,

  addAttributes() {
    return {
      id: {}
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
      ['span', 0],
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

  addKeyboardShortcuts() {
    return {
      ArrowRight: ({ editor }) => {
        const { $from, empty } = editor.state.selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const atEnd = $from.parentOffset === $from.parent.nodeSize - 2
        if (!atEnd) {
          return false
        }

        const after = $from.after()
        if (after === undefined) {
          return false
        }

        editor.commands.setTextSelection(after)
        return true
      },
      ArrowLeft: ({ editor }) => {
        const { $from, empty } = editor.state.selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const atStart = $from.parentOffset === 0
        if (!atStart) {
          return false
        }

        const before = $from.before()
        if (before === undefined) {
          return false
        }

        editor.commands.setTextSelection(before)
        return true
      },
    }
  }
})

export default NoteLink