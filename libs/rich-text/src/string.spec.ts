import { DocumentNode } from "./types"
import { toMarkdownString, toSearchString } from './string'

const doc: DocumentNode = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'heading text' }] },
    { type: 'horizontalRule' },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello ',
          marks: [{ type: 'italic' }, { type: 'strike' }]
        },
        {
          type: 'text',
          text: 'world!',
          marks: [{ type: 'bold' }]
        }
      ]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'another paragraph'
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'with a hard break'
        }
      ]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: "paragraph",
              content: [{ type: 'text', text: 'item 1' }]
            },
            {
              type: "bulletList",
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'nested 1' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'nested 2' }]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: "paragraph",
              content: [{ type: 'text', text: 'item 2' }]
            },
          ]
        }
      ]
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: "paragraph",
              content: [{ type: 'text', text: 'item 1' }]
            },
            {
              type: "orderedList",
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'nested 1' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'nested 2' }]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: "paragraph",
              content: [{ type: 'text', text: 'item 2' }]
            },
          ]
        }
      ]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'first level quote', marks: [{ type: 'italic' }, { type: 'code' }] }]
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'second level quote' }]
            }
          ]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'first level continued' }]
        },
      ]
    },
    {
      type: 'codeBlock',
      content: [
        { type: 'text', text: '#include <iostream>' }
      ]
    }
  ]
}

test('toString converts to markdown like format', () => {
  const str = `## heading text

---

_~Hello ~_*world!*

another paragraph
with a hard break

- item 1
  - nested 1
  - nested 2
- item 2

1. item 1
  1. nested 1
  2. nested 2
2. item 2

> \`_first level quote_\`
> 
> > second level quote
> 
> first level continued

\`\`\`
#include <iostream>
\`\`\``

  expect(toMarkdownString(doc)).toEqual(str)
})

test('toSearchString converts to text with no line breaks', () => {
  const str = "heading text Hello world! another paragraph with a hard break item 1 nested 1 nested 2 item 2 item 1 nested 1 nested 2 item 2 first level quote second level quote first level continued #include <iostream>"
  expect(toSearchString(doc)).toEqual(str)
})
