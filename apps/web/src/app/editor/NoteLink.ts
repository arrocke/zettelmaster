import { getAttributes, mergeAttributes, Mark } from '@tiptap/react'
import { Plugin, PluginKey } from 'prosemirror-state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    noteLink: {
      /**
       * Set a note link mark
       */
      setNoteLink: (attributes: { noteId: string }) => ReturnType,
      /**
       * Toggle a note link mark
       */
      toggleNoteLink: (attributes: { noteId: string }) => ReturnType,
      /**
       * Unset a note link mark
       */
      unsetNoteLink: () => ReturnType,
    }
  }
}

export interface NoteLinkOptions {
  onClick(href: string): void
}

const NoteLink = Mark.create<NoteLinkOptions>({
  name: 'noteLink',
  priority: 1000,
  keepOnSplit: false,
  inclusive: false,

  addOptions() {
    return {
      onClick(href) {
        window.location.href = href
      }
    }
  },

  addAttributes() {
    return {
      noteId: {}
    }
  },

  parseHTML() {
    return [
      { tag: 'a[data-type=note-link]' },
    ]
  },

  renderHTML({ HTMLAttributes, mark }) {
    return [
      'a',
      mergeAttributes(
        { 'data-type': 'note-link', href: `/notes/${mark.attrs['noteId']}` },
        HTMLAttributes
      ),
      0,
    ]
  },

  addCommands() {
    return {
      setNoteLink: attributes => ({ commands }) => {
        return commands
          .setMark(this.name, attributes)
      },

      toggleNoteLink: attributes => ({ commands }) => {
        return commands
          .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
      },

      unsetNoteLink: () => ({ commands }) => {
        return commands.unsetMark(this.name, { extendEmptyMarkRange: true })
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('handleClickLink'),
        props: {
          handleClick: (view, pos, event) => {
            const attrs = getAttributes(view.state, this.name)
            const link = (event.target as HTMLElement)?.closest('a')
            if (link && attrs['noteId']) {
              this.options.onClick(`/notes/${attrs['noteId']}`)
              return true
            }
            return false
          },
        }
      })
    ]
  }
})

export default NoteLink