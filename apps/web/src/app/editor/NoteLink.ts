import { mergeAttributes, Node, ReactRenderer } from '@tiptap/react'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
import tippy, { Instance } from 'tippy.js'
import NoteSuggestionList, { NoteSuggestionListProps, NoteSuggestionListRef } from './NoteSuggestionList'

export type NoteLinkOptions = {
  HTMLAttributes: Record<string, any>,
  renderLabel: (props: {
    options: NoteLinkOptions,
    node: ProseMirrorNode,
  }) => string,
  suggestion: Omit<SuggestionOptions, 'editor'>,
}

export const NoteLinkPluginKey = new PluginKey('note-link')

export const NoteLink = Node.create<NoteLinkOptions>({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs['noteId']}`
      },
      suggestion: {
        char: '[[',
        pluginKey: NoteLinkPluginKey,
        items: async ({ editor, query }) => {
          const response = await fetch('/api/notes')
          if (response.status === 200) {
            const { data } = await response.json()
            return data
          } else {
            return []
          }
        },
        command: ({ editor, range, props }) => {
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace) {
            range.to += 1
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()

          window.getSelection()?.collapseToEnd()
        },
        render: () => {
          let component: ReactRenderer<NoteSuggestionListRef, NoteSuggestionListProps & React.RefAttributes<NoteSuggestionListRef>>
          let popup: Instance[]

          return {
            onStart: props => {
              component = new ReactRenderer(NoteSuggestionList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) {
                return
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect as any,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              })
            },

            onUpdate(props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect as any,
              })
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                popup[0].hide()

                return true
              }

              return component.ref?.onKeyDown(props) ?? false
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
        allow: ({ state, range }) => {
          // Determine if the parent node can support note links.
          // For example, a paragraph can have a note link, but a bullet list cannot.
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          return !!$from.parent.type.contentMatch.matchType(type)
        },
      },
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      noteId: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes['noteId']) {
            return {}
          }

          return {
            'data-id': attributes['noteId']
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `a[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      mergeAttributes({ 'data-type': this.name, href: `/notes/${node.attrs['noteId']}` }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ]
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    })
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

export default NoteLink