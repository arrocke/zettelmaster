import {
  CodeBlockNode,
  DocumentNode,
  LinkMark,
  TextNode,
} from './types'
import {
  findMark,
  findNode,
  filterNodes,
  filterMarks,
} from './search'

describe('findNode', () => {
  test('returns found inline node', () => {
    const nodeToFind: TextNode = {
      type: 'text',
      text: 'world',
      marks: [{ type: 'bold' }],
    }
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello ', marks: [] }, nodeToFind],
        },
      ],
    }
    expect(
      findNode(
        data,
        (node) =>
          node.type === 'text' &&
          !!node.marks?.some((mark) => mark.type === 'bold')
      )
    ).toEqual(nodeToFind)
  })

  test('returns found block node', () => {
    const nodeToFind: CodeBlockNode = {
      type: 'codeBlock',
      content: [{ type: 'text', text: 'hello world', marks: [] }],
    }
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello ', marks: [] }],
        },
        nodeToFind,
      ],
    }
    expect(findNode(data, (node) => node.type === 'codeBlock')).toEqual(
      nodeToFind
    )
  })

  test('returns undefined if no node is found', () => {
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world', marks: [] }],
        },
      ],
    }
    expect(findNode(data, (node) => node.type === 'blockquote')).toEqual(
      undefined
    )
  })
})

describe('filterNodes', () => {
  test('returns list of nodes that match the condition', () => {
    const nodesToFind: TextNode[] = [
      { type: 'text', text: 'Hello', marks: [] },
      {
        type: 'text',
        text: 'world',
        marks: [{ type: 'bold' }],
      },
    ]
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [nodesToFind[0]],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [nodesToFind[1]],
                },
              ],
            },
          ],
        },
      ],
    }
    expect(filterNodes(data, (node) => node.type === 'text')).toEqual(
      nodesToFind
    )
  })

  test('returns empty list if no nodes match condition', () => {
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world', marks: [] }],
        },
      ],
    }
    expect(filterNodes(data, (node) => node.type === 'blockquote')).toEqual([])
  })
})

describe('findMark', () => {
  test('returns found mark', () => {
    const markToFind: LinkMark = {
      type: 'link',
      attrs: { href: 'https://google.com' },
    }
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ', marks: [] },
            { type: 'text', text: 'Google', marks: [markToFind] },
          ],
        },
      ],
    }
    expect(findMark(data, (mark) => mark.type === 'link')).toEqual(markToFind)
  })

  test('returns undefined if no mark is found', () => {
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world', marks: [] }],
        },
      ],
    }
    expect(findMark(data, (mark) => mark.type === 'bold')).toEqual(undefined)
  })
})

describe('filterMarks', () => {
  test('returns list of marks that match the condition', () => {
    const marksToFind: LinkMark[] = [
      { type: 'link', attrs: { href: 'https://google.com' } },
      { type: 'link', attrs: { href: 'https://apple.com' } },
    ]
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'some text' },
            { type: 'text', text: 'Google', marks: [marksToFind[0]] },
          ],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'some more text' },
                    { type: 'text', text: 'Apple', marks: [marksToFind[1]] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
    expect(filterMarks(data, (mark) => mark.type === 'link')).toEqual(
      marksToFind
    )
  })

  test('returns empty list if no nodes match condition', () => {
    const data: DocumentNode = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world', marks: [] }],
        },
      ],
    }
    expect(filterNodes(data, (node) => node.type === 'blockquote')).toEqual([])
  })
})
