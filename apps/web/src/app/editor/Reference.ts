import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import { PluginKey } from 'prosemirror-state'
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

export const ReferencePluginKey = new PluginKey('reference')

const Reference = Node.create<any, { openReferenceSearch?(): void }>({
  name: 'reference',

  marks: '',
  group: 'inline',
  inline: true,

  addStorage() {
    return {}
  },

  addAttributes() {
    return {
      id: {},
      location: {
        default: ''
      }
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
      setReference: attributes => ({ editor, commands }) => {
        return commands
          .insertContentAt(editor.state.selection.$anchor.pos, [{ type: this.name, attrs: attributes }])
      }
    }
  },

  addInputRules() {
    return [{
      find: /\[\^/,
      handler: ({ commands, range }) => {
        commands.deleteRange(range)
        this.storage.openReferenceSearch?.()
      }
    }]
  }
})

export default Reference